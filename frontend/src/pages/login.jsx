import React, { useRef, useState } from "react";
import { Description, Dialog, Label, Input, Field, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { useStateContext } from "../context/contextProvider";
import API from "../utils/API";
import { useNavigate } from "react-router-dom";

function LogIn({ isOpen, setIsOpen }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(false);
    
    const {setUser, setToken, setRefreshToken} = useStateContext();

    const submit = async () => {
        try {
            const payload = {
                email: emailRef.current.value,
                password: passwordRef.current.value,
                remember_me: rememberMe
            }
            const response = await API.post("/login", payload);
            console.log("Response from server:", response);
    
            if (response.data.user && response.data.access_token && response.data.refresh_token) {
                setUser(response.data.user);
                setToken(response.data.access_token);
                setRefreshToken(response.data.refresh_token);
                navigate('/home');
                setIsOpen(false);
            } else {
                console.error("Unexpected response format", response);
            }
        } catch (error) {
            console.error("Login failed", error.response?.data.errors || error.message);
        }
    };


    return (
        <Transition appear show={isOpen} as="div">
            <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
                {/* Fixed backdrop outside of Transition.Child */}
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
                
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Transition.Child
                        as="div"
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="w-[450px] max-w-xl rounded-xl shadow-2xl bg-dark border-2 border-white bg-white/5 p-6 backdrop-blur-2xl">
                            <DialogTitle className="font-bold text-white mb-3" style={{ fontSize:"1.5em"}}>Sveiki sugrįžę</DialogTitle>
                            <Field className="mb-4">
                                <Label className="text-white mb-3" style={{ fontSize:"1.2em"}}>El. Paštas</Label>
                                <Input type="text" ref={emailRef} name="email" className="w-full bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite el.paštą" />
                            </Field>

                            <Field>
                                <Label className="text-white mb-3" style={{ fontSize:"1.2em"}}>Slaptažodis</Label>
                                <Input type="password" ref={passwordRef} name="password" className="w-full bg-transparent placeholder:text-slate-400 text-white text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite slaptąžodį" />
                            </Field>
                            
                            <div className="flex items-center mt-4">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                    className="h-4 w-4 rounded border-gray-300 text-lght-blue focus:ring-lght-blue cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-white cursor-pointer">
                                    Prisiminti mane
                                </label>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button className="px-2 py-1 text-center font-light items-center bg-lght-blue ring-lght-blue rounded-md ring-1 border-slate-300 text-white text-xl hover:bg-grey duration-300 transition-colors"  
                                    onClick={() => submit()}>Prisijungti</button>
                                <button className="px-2 py-1 text-center font-light rounded-md border-slate-300 text-white text-xl hover:bg-grey ring-1 ring-white hover:border-grey hover:text-lightest-blue duration-300 transition-colors" 
                                    onClick={() => setIsOpen(false)}>Atšaukti</button>
                            </div>
                        </DialogPanel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}

export default LogIn;
