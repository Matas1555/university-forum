import React, { useRef } from "react";
import { Description, Dialog, Label, Input, Field, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import API from "../API";
import { useStateContext } from "../context/contextProvider";
import { useNavigate } from "react-router-dom";

function Register({ isOpen, setIsOpen }) {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    const {setUser, setToken} = useStateContext();

    const submit = async () => {
        try {
            const payload = {
                username: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
            }
            const response = await API.post("/register", payload);
            console.log("Response from server:", response);
    
            if (response.data.user && response.data.token) {
                setUser(response.data.user);
                setToken(response.data.token);
                navigate('/home');
                setIsOpen(false);
            } else {
                console.error("Unexpected response format", response);
            }
        } catch (error) {
            console.error("Registration failed", error.response?.data.errors || error.message);
        }
    };

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel
                transition
                className="w-full max-w-md rounded-xl shadow-2xl bg-lightest-blue border-2 border-blue bg-white/5 p-6 backdrop-blur-2xl duration-200 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
                {/* <DialogPanel className="max-w-lg space-y-4 rounded-md border-2 backdrop-blur-2xl border-blue bg-lightest-blue p-12"> */}
                    <DialogTitle className="font-bold text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.5em"}}>Prisijunkite prie bendruomenės!</DialogTitle>

                    <Field className="mb-4">
                        <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Slapyvardis</Label>
                        <Input type="text" ref={nameRef} name="username" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite vardą, kurį matys kiti naudotojai" />
                    </Field>

                    <Field className="mb-4">
                        <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>El. Paštas</Label>
                        <Input type="text" ref={emailRef} name="email" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite el.paštą" />
                    </Field>

                    <Field>
                        <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Slaptažodis</Label>
                        <Input type="text" ref={passwordRef} name="password" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite slaptąžodį" />
                    </Field>


                    <div className="flex gap-4 mt-8">
                        <button className="pl-4 pr-4 pt-1 pb-2 text-center bg-lightest-blue border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors"  
                            onClick={() => submit()}>Registruotis</button>
                        <button className="pl-4 pr-4 pt-1 pb-2 text-center bg- border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors" 
                            onClick={() => setIsOpen(false)}>Atšaukti</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}

export default Register;
