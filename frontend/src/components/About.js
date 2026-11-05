// import React from 'react'

// const About = () => {
//     return (
//         <>
//             <div className="container">
//                 <h3 className="py-3">About Us</h3>
//                 <p>
//                     Ask Your Doctor is a platform for booking medical consultations with specialist doctors in your city online. Patient can book an
//                     appointment by selecting any of the time slot given by doctor.</p>
//                 <p> Some additional functionalities are - user can search
//                     doctor by specialization and city, both user and doctor can manage their booked appointments, both can manage
//                     their appointment history, verification of doctor's credentials by admin and users can get information about blood donors in their city.
//                 </p>
//                 <p className="text-muted">Regards, from creators:
//                     <ul>

//                     </ul>
//                 </p>
//             </div>
//         </>
//     )
// }

// export default About

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
function AboutUs() {
  return (
    <>
      <div className="mx-4">
        <Tabs
          defaultActiveKey="home"
          id="justify-tab-example"
          className="mb-3"
          justify
        >
          <Tab eventKey="home" title="About US">

            <Card>
              <Card.Body><b>1. Welcome to KM clinic and Hospital, a leading healthcare institution dedicated to providing exceptional medical care, compassion, and innovation. <br /> 2. Our commitment to your health and well-being is unwavering, and we take pride in being a trusted healthcare partner for you and your loved ones.</b></Card.Body>
            </Card>
            <br />
            <br />

          </Tab>
          <Tab eventKey="profile" title="our vision">
            <Card className='ml-3 mr-3'>
              <Card.Body><b>At KM CLINIC AND HOSPITAL, our vision is to be a beacon of excellence and innovation in healthcare, inspiring hope and transforming lives. We strive to create a healthcare ecosystem that seamlessly integrates cutting-edge technology, compassionate care, and patient empowerment, setting new benchmarks for healthcare delivery.</b>
                <br /><br />

                <b>1.Pioneering Healthcare Advancements:- </b>
                <br />
                We envision a future where medical breakthroughs are not just anticipated, but actively pursued. <br /> Our commitment to research and innovation drives us to explore new frontiers in medicine, uncovering novel treatments and therapies that have the potential to revolutionize healthcare outcomes.
                <br />
                <br />
                <b>2.Empowering Patients, Enriching Lives:-</b>
                <br />
                Our vision extends beyond medical procedures; it encompasses a holistic approach to patient care. <br /> We aim to empower our patients with the knowledge, tools, and support they need to actively participate in their health management. By fostering a partnership between patients and healthcare providers, we seek to improve lives and promote long-lasting well-being.
                <br /><br />
                <b>3.Global Impact, Local Roots:-</b>
                While our aspirations are global, our roots remain firmly embedded in the local community. <br /> We envision KM CLINIC AND HOSPITAL as a catalyst for positive change, addressing the unique healthcare needs of our community while also contributing to the larger landscape of healthcare advancements worldwide.
                <br /><br />
                <b>4.Unparalleled Patient Experience:-</b>
                <br />
                We aspire to set new standards for the patient experience. Our vision includes creating an environment where patients and their families feel valued, heard, and cared for at every stage of their healthcare journey. <br /> From personalized treatment plans to streamlined processes, we are dedicated to making healthcare accessible, efficient, and compassionate.
                <br /><br />
                <b>5.Collaboration and Partnerships:- </b>
                <br />
                We envision KM CLINIC AND HOSPITAL as a hub of collaboration, where healthcare professionals, researchers, and innovators come together to exchange ideas, share knowledge, and collaborate on projects that have the potential to shape the future of healthcare. <br /> By forging strong partnerships, we aim to drive positive change in healthcare delivery and outcomes.
                <br /><br />
                <b>6.Leadership in Preventive Care:-</b>
                <br />
                Prevention is the cornerstone of a healthier society. Our vision includes a proactive approach to healthcare, with a strong emphasis on preventive measures, health education, and community engagement. <br /> By raising awareness and promoting healthy lifestyles, we aim to reduce the burden of preventable illnesses.
                <br /><br />
                <b>7.A Legacy of Excellence:-</b>
                <br />
                Ultimately, our vision is to leave a lasting legacy of excellence, compassion, and innovation. We aspire to be remembered not only for our medical achievements but also for the positive impact we make on the lives of individuals and the communities we serve.
                <br />
                Thank you for joining us on this journey towards a brighter, healthier future. Together, we can redefine healthcare and create a world where every individual can thrive.</Card.Body>
            </Card>


          </Tab>
          <Tab eventKey="longer-tab" title="our mission">
            <Card>
              <Card.Body><b> 1. At KM CLINIC AND HOSPITAL Hosiptal, our mission is to deliver superior healthcare services that empower individuals to lead healthier lives. <br /> 2. We strive to combine advanced medical technology with compassionate care to ensure every patient receives the attention and treatment they deserve.</b>
                <br />
                <br />
                <b>1. Expertise and Excellence:- </b>
                <br />
                With a team of highly skilled physicians, surgeons, nurses, and support staff, [Your Hospital Name] is renowned for its expertise across a wide range of medical specialties. <br /> Our professionals are dedicated to staying at the forefront of medical advancements, continuously honing their skills to offer the best possible care.
                <br />
                <br />
                <b>2.Patient-Centered Approach:-</b>
                <br />
                1. We understand that each patient is unique, and their healthcare journey should be tailored to their specific needs. <br /> 2.Our patient-centered approach ensures that you are actively involved in decisions about your care, and we take the time to listen to your concerns and answer your questions.
                <br />
                <br />
                <b>3.State-of-the-Art :- </b>
                <br />
                Equipped with cutting-edge technology and modern infrastructure, [Your Hospital Name] provides a safe and comfortable environment for diagnosis, treatment, and recovery. <br /> From advanced surgical theaters to well-equipped diagnostic labs, we are committed to offering top-tier facilities that enhance the quality of care.
                <br />
                <br />
                <b>4.Compassionate Care:- </b>
                <br />
                We believe that healthcare goes beyond medical procedures. Compassion, empathy, and a caring touch are integral to the healing process. <br /> Our dedicated healthcare professionals are not only experts in their fields but also kind and understanding individuals who are here to support you every step of the way.
                <br />
                <br />
                <b>5.Community Engagement:- </b>
                <br />
                As a responsible healthcare institution, we actively engage with our community through health awareness campaigns, educational seminars, and preventive care programs. <br /> We believe in promoting wellness and disease prevention to create a healthier society.
                <br />
                <br />
                <b>6.Research and Innovation:- </b>
                <br />
                Innovation drives progress in healthcare, and [Your Hospital Name] is committed to pushing the boundaries of medical science. <br /> Our collaboration with research institutions and participation in clinical trials ensure that our patients have access to the latest treatments and therapies.</Card.Body>
            </Card>

          </Tab>
          {/* <Tab eventKey="contact" title="our objective" className='justify-content' >
       

      </Tab> */}
        </Tabs>

        <div className="container ">
          <div className="row md-6">
            <h3 className='mt-4'>KM CLINIC AND HOSPITAL Location</h3>
            <iframe
              title="KM Clinic and Hospital Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4212.073243541526!2d79.25858607535874!3d12.664626421533681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad29001124eeb7%3A0x4a8192b4ff359fd9!2sKM%20HOSPITAL!5e1!3m2!1sen!2sin!4v1793910688281!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>

    </>
  );
}

export default AboutUs;