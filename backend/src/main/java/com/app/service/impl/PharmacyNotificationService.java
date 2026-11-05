package com.app.service.impl;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.entity.modal.Medicine;
import com.app.entity.modal.PharmacyBill;
import com.app.repository.MedicineRepository;
import com.app.util.InvoicePdfGenerator;

import javax.mail.internet.MimeMessage;
import javax.mail.util.ByteArrayDataSource;

/**
 * Email / WhatsApp / expiry notifications for the pharmacy module.
 * Failures are logged and never break the billing transaction.
 */
@Service
public class PharmacyNotificationService {

    private static final Logger log = LoggerFactory.getLogger(PharmacyNotificationService.class);

    @Autowired private JavaMailSender mailSender;
    @Autowired private InvoicePdfGenerator pdfGenerator;
    @Autowired private MedicineRepository medicineRepo;

    @Value("${spring.mail.username:}") private String fromEmail;

    /** Address that receives the daily expiry / low-stock digest (e.g. the pharmacist). */
    @Value("${pharmacy.alert.email:}") private String alertEmail;
    @Value("${pharmacy.expiry.warning-days:30}") private int expiryWarningDays;

    // Twilio WhatsApp (disabled unless pharmacy.whatsapp.enabled=true and credentials are set)
    @Value("${pharmacy.whatsapp.enabled:false}") private boolean whatsappEnabled;
    @Value("${pharmacy.whatsapp.twilio.account-sid:}") private String twilioSid;
    @Value("${pharmacy.whatsapp.twilio.auth-token:}") private String twilioToken;
    @Value("${pharmacy.whatsapp.twilio.from:}") private String twilioFrom; // e.g. whatsapp:+14155238886
    @Value("${pharmacy.whatsapp.default-country-code:+91}") private String countryCode;

    /** Emails the invoice PDF to the patient. */
    public void sendBillEmail(PharmacyBill bill) {
        String to = bill.getPatient().getEmail();
        if (to == null || to.isEmpty()) {
            log.warn("Patient has no email; skipping bill email for bill {}", bill.getId());
            return;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true);
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Pharmacy Invoice INV-" + String.format("%06d", bill.getId()));
            helper.setText("Dear " + bill.getPatient().getFirstName() + ",\n\nThank you for your purchase. "
                    + "Your total is Rs. " + bill.getTotalAmount() + ". Invoice attached.\n\nKM Clinic and Hospital");
            helper.addAttachment("invoice-" + bill.getId() + ".pdf",
                    new ByteArrayDataSource(pdfGenerator.generate(bill), "application/pdf"));
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to email bill {}: {}", bill.getId(), e.getMessage());
        }
    }

    /** Sends a WhatsApp purchase confirmation through Twilio's REST API. */
    public void sendWhatsAppConfirmation(PharmacyBill bill) {
        if (!whatsappEnabled || twilioSid.isEmpty() || twilioToken.isEmpty() || twilioFrom.isEmpty()) {
            log.info("WhatsApp disabled/not configured; skipping confirmation for bill {}", bill.getId());
            return;
        }
        String mobile = bill.getPatient().getMobileNumber();
        if (mobile == null || mobile.isEmpty()) {
            return;
        }
        try {
            String body = "Hi " + bill.getPatient().getFirstName() + ", your pharmacy purchase (INV-"
                    + String.format("%06d", bill.getId()) + ") of Rs. " + bill.getTotalAmount()
                    + " is confirmed. - KM Clinic and Hospital";
            String form = "To=" + enc("whatsapp:" + countryCode + mobile) + "&From=" + enc(twilioFrom)
                    + "&Body=" + enc(body);
            String auth = Base64.getEncoder()
                    .encodeToString((twilioSid + ":" + twilioToken).getBytes(StandardCharsets.UTF_8));
            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.twilio.com/2010-04-01/Accounts/" + twilioSid + "/Messages.json"))
                    .header("Authorization", "Basic " + auth)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .POST(HttpRequest.BodyPublishers.ofString(form)).build();
            HttpResponse<String> resp = HttpClient.newHttpClient().send(req, HttpResponse.BodyHandlers.ofString());
            if (resp.statusCode() >= 300) {
                log.error("Twilio WhatsApp failed: {} {}", resp.statusCode(), resp.body());
            }
        } catch (Exception e) {
            log.error("WhatsApp confirmation failed for bill {}: {}", bill.getId(), e.getMessage());
        }
    }

    /** Runs daily at 08:00: emails the pharmacist a digest of expiring/expired medicines. */
    @Scheduled(cron = "${pharmacy.expiry.cron:0 0 8 * * *}")
    @Transactional(readOnly = true)
    public void notifyExpiringMedicines() {
        if (alertEmail.isEmpty()) {
            return;
        }
        java.time.LocalDate today = java.time.LocalDate.now();
        List<Medicine> expiring = medicineRepo.findByExpiryDateBetweenOrderByExpiryDateAsc(today,
                today.plusDays(expiryWarningDays));
        List<Medicine> expired = medicineRepo.findByExpiryDateBeforeOrderByExpiryDateAsc(today);
        if (expiring.isEmpty() && expired.isEmpty()) {
            return;
        }
        StringBuilder sb = new StringBuilder("EXPIRED:\n");
        expired.forEach(m -> sb.append(" - ").append(line(m)).append('\n'));
        sb.append("\nEXPIRING WITHIN ").append(expiryWarningDays).append(" DAYS:\n");
        expiring.forEach(m -> sb.append(" - ").append(line(m)).append('\n'));
        try {
            org.springframework.mail.SimpleMailMessage mail = new org.springframework.mail.SimpleMailMessage();
            mail.setFrom(fromEmail);
            mail.setTo(alertEmail);
            mail.setSubject("Pharmacy: medicine expiry alert");
            mail.setText(sb.toString());
            mailSender.send(mail);
        } catch (Exception e) {
            log.error("Failed to send expiry alert: {}", e.getMessage());
        }
    }

    private String line(Medicine m) {
        return m.getMedicineName() + " (batch " + m.getBatchNumber() + ", qty " + m.getQuantity()
                + ") expires " + m.getExpiryDate();
    }

    private String enc(String s) {
        return URLEncoder.encode(s, StandardCharsets.UTF_8);
    }
}

