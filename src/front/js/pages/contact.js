import React, { useContext, useState, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/contact.css";
import emailjs from "@emailjs/browser";

export const Contactus = () => {
    const form = useRef();
    const { store, actions } = useContext(Context);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    // ui658ZPOA12dMvT_e
    

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents default form submission behavior
        console.log({ name, email, subject, message });

    const isValid = () => {
        // const formdata = new FormData(form.current)
        // const name = formdata.get("from_name")
        // const email = formdata.get("from_email")
        // const subject = formdata.get("subject")
        // const message = formdata.get("message")
        console.log(name, email, subject, message)


        if (name.length > 3 || email.includes("@") || subject.length > 1){
            return true
        }
        else return false
    }

    const checkValidation = isValid()

    if (checkValidation) {
        emailjs.sendForm("service_glj46sa", "template_vkp23ks", form.current, "ui658ZPOA12dMvT_e").then(
            (result) => {
              console.log(result);
               });

            (error) => {
                console.log(error);
            };
  
    
    }

        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
    };

    return (
        <div className="mt-0 mb-0" id="background-color">
        <section className="p-3">
            <h2 className="h1-responsive font-weight-bold text-center ">Contact us</h2>
            <p className="text-center w-responsive mx-auto mb-4">
                Have questions or comments? Please send us a message!
            </p>

            <div className="row">
                <div className="col-md-9 mb-md-0 mb-5">
                    <form ref = {form} id="contact-form" name="contact-form" onSubmit={handleSubmit}>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="md-form mb-0">
                                    <label htmlFor="name" className={name ? "active" : ""}>Your name</label>
                                    <input type="text" id="name" name="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                                    
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="md-form mb-0">
                                    <label htmlFor="email" className={email ? "active" : ""}>Your email</label>
                                    <input type="text" id="email" name="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="md-form mb-0">
                                    <label htmlFor="subject" className={subject ? "active" : ""}>Subject</label>
                                    <input type="text" id="subject" name="subject" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="md-form">
                                    <label htmlFor="message">Your message</label>
                                    <textarea type="text" id="message" name="message" rows="2" className="form-control md-textarea" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-md-left">
                            <button className="btn btn-primary" type="submit">Send</button>
                        </div>
                    </form>
                </div>

                <div className="col-md-3 text-center">
                    <ul className="list-unstyled mb-0">
                        <li><i className="fas fa-map-marker-alt fa-2x"></i>
                            <p>Miami, FL USA</p>
                        </li>
                        <li><i className="fas fa-phone mt-4 fa-2x"></i>
                            <p>012-345-6789</p>
                        </li>
                        <li><i className="fas fa-envelope mt-4 fa-2x"></i>
                            <p>artseekersteam@gmail.com</p>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        </div>
    );
};