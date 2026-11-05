package com.app.util;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Component;

import com.app.entity.modal.BillItem;
import com.app.entity.modal.PharmacyBill;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

/** Renders a {@link PharmacyBill} as a PDF invoice using OpenPDF. */
@Component
public class InvoicePdfGenerator {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");

    public byte[] generate(PharmacyBill bill) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 40, 40, 40, 40);
        try {
            PdfWriter.getInstance(doc, out);
            doc.open();

            Font title = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font bold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
            Font normal = FontFactory.getFont(FontFactory.HELVETICA, 10);

            Paragraph h = new Paragraph("KM CLINIC AND HOSPITAL - PHARMACY INVOICE", title);
            h.setAlignment(Element.ALIGN_CENTER);
            h.setSpacingAfter(15);
            doc.add(h);

            doc.add(new Paragraph("Invoice No: INV-" + String.format("%06d", bill.getId()), bold));
            doc.add(new Paragraph("Date: " + (bill.getBillDate() != null ? bill.getBillDate().format(FMT) : "-"), normal));
            doc.add(new Paragraph("Patient: " + bill.getPatient().getFirstName() + " "
                    + bill.getPatient().getLastName(), normal));
            doc.add(new Paragraph("Pharmacy: " + (bill.getLocation() != null ? bill.getLocation().getName() : "-"), normal));
            doc.add(new Paragraph("Payment: " + bill.getPaymentMode() + " (" + bill.getPaymentStatus() + ")", normal));
            doc.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(new float[] { 4, 1.5f, 2, 2 });
            table.setWidthPercentage(100);
            for (String col : new String[] { "Medicine", "Qty", "Unit Price", "Total" }) {
                PdfPCell c = new PdfPCell(new Phrase(col, bold));
                c.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
                c.setPadding(5);
                table.addCell(c);
            }
            for (BillItem i : bill.getBillItems()) {
                table.addCell(cell(i.getMedicine().getMedicineName(), normal, Element.ALIGN_LEFT));
                table.addCell(cell(String.valueOf(i.getQuantity()), normal, Element.ALIGN_CENTER));
                table.addCell(cell(money(i.getUnitPrice()), normal, Element.ALIGN_RIGHT));
                table.addCell(cell(money(i.getLineTotal()), normal, Element.ALIGN_RIGHT));
            }
            doc.add(table);

            PdfPTable totals = new PdfPTable(2);
            totals.setWidthPercentage(40);
            totals.setHorizontalAlignment(Element.ALIGN_RIGHT);
            totals.setSpacingBefore(10);
            totals.addCell(cell("Subtotal", normal, Element.ALIGN_LEFT));
            totals.addCell(cell(money(bill.getSubtotal()), normal, Element.ALIGN_RIGHT));
            totals.addCell(cell("Tax (" + bill.getTaxPercent() + "%)", normal, Element.ALIGN_LEFT));
            totals.addCell(cell(money(bill.getTaxAmount()), normal, Element.ALIGN_RIGHT));
            totals.addCell(cell("TOTAL", bold, Element.ALIGN_LEFT));
            totals.addCell(cell(money(bill.getTotalAmount()), bold, Element.ALIGN_RIGHT));
            doc.add(totals);

            Paragraph f = new Paragraph("\nThank you. Get well soon!", normal);
            f.setAlignment(Element.ALIGN_CENTER);
            doc.add(f);
        } catch (DocumentException e) {
            throw new IllegalStateException("Failed to generate invoice PDF", e);
        } finally {
            doc.close();
        }
        return out.toByteArray();
    }

    private PdfPCell cell(String text, Font font, int align) {
        PdfPCell c = new PdfPCell(new Phrase(text, font));
        c.setHorizontalAlignment(align);
        c.setPadding(5);
        return c;
    }

    private String money(BigDecimal v) {
        return "Rs. " + (v == null ? "0.00" : v.setScale(2, java.math.RoundingMode.HALF_UP).toPlainString());
    }
}

