import React, { useEffect, useRef, useState } from "react";
import { Label, Input, Field, Textarea, Select, Listbox, ListboxButton, ListboxOptions, ListboxOption} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import { BackwardIcon} from '@heroicons/react/20/solid';
import API from "../API";
import { useStateContext } from "../context/contextProvider";
import { useNavigate } from "react-router-dom";
import Datepicker from "tailwind-datepicker-react"

function Register() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const bioRef = useRef();
    const yearRef = useRef();
    const statusRef = useRef();
    const universityRef = useRef();
    const programRef = useRef();

    const [universities, setUniversities] = useState([]);
    const [statuses, setStatus] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [isLoading, setIsLoading] = useState(true);


    const navigate = useNavigate();

    const {setUser, setToken} = useStateContext();

    const [show, setShow] = useState(false);

    const options = {
        title: "Pasirinkite datą",
        autoHide: true,
        todayBtn: true,
        clearBtn: true,
        clearBtnText: "Išvalyti",
        todayBtnText: "Šiandien",
        maxDate: new Date("2100-01-01"),
        minDate: new Date("1950-01-01"),
        theme: {
            background: "bg-lightest-blue",
            todayBtn: "hover:bg-light-blue",
            clearBtn: "hover:bg-light-blue",
            icons: "hover:bg-light-blue",
            text: "hover:bg-light-blue",
            disabledText: "bg-red-500",
            input: "",
            inputIcon: "hover:bg-light-blue",
            selected: "hover:bg-light-blue",
        },
        icons: {
            // () => ReactElement | JSX.Element
            prev: () => <svg className="hover:bg-light-blue size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
          </svg>
          ,
            next: () => <svg className="hover:bg-light-blue size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
          </svg>
          ,
        },
        datepickerClassNames: "rounded-md border-2 pt-0 ml-70",
        defaultDate: new Date("2022-01-01"),
        language: "lt",
        disabledDates: [],
        weekDays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
        inputNameProp: "date",
        inputIdProp: "date",
        inputPlaceholderProp: "Select Date",
        inputDateFormatProp: {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    }

	const handleChange = (selectedDate) => {
		console.log(selectedDate)
	}
	const handleClose = (state) => {
		setShow(state)
	}

    useEffect(() => {
        API.get('/universities').then((response) => {
            console.log(response);
            setUniversities(response.data);
            setSelectedUniversity(response.data[0]);
        })

        API.get('/statuses').then((response) => {
            console.log(response);
            setStatus(response.data);
            setSelectedStatus(response.data[0]);
            setIsLoading(false);
        })
    }, [])

    useEffect(() => {
        console.log(selectedStatus);
    }, [selectedStatus])

    const handleUniversityChange = (university) => {
        const universityID = university.id;
        setSelectedUniversity(university);
        setSelectedProgram(null);

        API.get(`/universities/${universityID}/programs`).then((response) => {
            console.log(response);
            setPrograms(response.data); 
        })
    }

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
        <>
        <div className="pl-20 pr-20 pt-20 max-w-5xl m-auto">
            <Field className="mb-4">
                <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Slapyvardis</Label>
                <Input type="text" ref={nameRef} name="username" className="w-full bg-lightest-blue bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite vardą, kurį matys kiti naudotojai" />
            </Field>

            <Field className="mb-4">
                <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>El. Paštas</Label>
                <Input type="text" ref={emailRef} name="email" className="w-full bg-lightest-blue bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite el.paštą" />
            </Field>

            <Field className="mb-4">
                <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Jūsų aprašymas</Label>
                <Textarea type="text" ref={bioRef} name="bio" className="w-full bg-lightest-blue bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite kažką apie save :)" />
            </Field>

            
            <Field className="mb-4">
                <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Statusas</Label>
                {isLoading ? (<></>):
                (
                    <Listbox value={selectedStatus.name} onChange={setSelectedStatus}>
                        <ListboxButton
                            className="relative block w-full rounded-lg bg-lightest-blue border-s-2 border-e-2 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white"
                            >
                            {selectedStatus.name}
                            <ChevronDownIcon
                                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions
                            anchor="bottom start"
                            transition
                            className="mt-2 origin-top transition rounded-md duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 bg-lightest-blue "
                            style={{ position: "relative", zIndex: 1, border:"1px solid black"}}
                            >
                            {statuses.map((value) => (
                                <ListboxOption
                                key={value.id}
                                value={value}
                                className="group flex cursor-default items-center gap-2 rounded-lg py-2.5 px-3 select-none hover:bg-white/20"
                                >
                                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                                <div className="text-sm/6 text-white">{value.name}</div>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                )} 
            </Field >

            <Field className="mb-4">
                <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Universitetas</Label>
                {isLoading ? (<></>):
                (
                    <Listbox value={selectedUniversity.name} onChange={handleUniversityChange}>
                        <ListboxButton
                            className="relative block w-full rounded-lg bg-lightest-blue border-s-2 border-e-2 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white"
                            >
                            {selectedUniversity ? selectedUniversity.name : "Pasirinkite universitetą"}
                            <ChevronDownIcon
                                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                aria-hidden="true"
                            />
                        </ListboxButton>
                        <ListboxOptions
                            anchor="bottom start"
                            transition
                            className="mt-2 max-h-52 h-52 origin-top transition rounded-md duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 bg-lightest-blue "
                            style={{ position: "relative", zIndex: 1, border:"1px solid black"}}
                            >
                            {universities.map((value) => (
                                <ListboxOption
                                key={value.id}
                                value={value}
                                className="group flex cursor-default items-center gap-2 rounded-lg py-2.5 px-3 select-none hover:bg-white/20"
                                >
                                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                                <div className="text-sm/6 text-white">{value.name}</div>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </Listbox>
                )} 
            </Field >

            <Field className="mb-4">
                <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Studijų programa </Label>
                {selectedUniversity ? (
                    <Listbox value={selectedProgram} onChange={setSelectedProgram}>
                        <ListboxButton 
                            className="relative block w-full rounded-lg bg-lightest-blue border-s-2 border-e-2 py-1.5 pr-8 pl-3 text-left text-sm/6 text-white"
                            >
                            {selectedProgram ? selectedProgram.title : "Pasirinkite programą"}
                            <ChevronDownIcon className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60" aria-hidden="true" />
                        </ListboxButton>
                        <ListboxOptions 
                            anchor="bottom start"
                            transition
                            className="mt-2 max-h-48 origin-top transition rounded-md duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 bg-lightest-blue"
                            style={{ position: "relative", zIndex: 1, border: "1px solid black" }}
                            >
                            {programs.length === 0 ? (
                                <p className="text-white px-3 py-2">Nėra programų</p>
                            ) : (
                                programs.map((value) => (
                                    <ListboxOption key={value.id} value={value} className="group flex cursor-default items-center gap-2 rounded-lg py-2.5 px-3 select-none hover:bg-white/20">
                                        <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                                        <div className="text-sm/6 text-white">{value.title}</div>
                                    </ListboxOption>
                                ))
                            )}
                        </ListboxOptions>
                    </Listbox>
                ) : <p>Pasirinkite universitetą</p>}
            </Field >

            <Field className="mb-4 relative">
                <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Metai kada baigsite mokslus</Label>
                <Datepicker options={options} show={show} setShow={handleClose} onChange={handleChange}/>
            </Field>

            <Field className="mb-4">
                <Label className="text-blue mb-3" style={{fontFamily: "Inter", fontSize:"1.2em"}}>Slaptažodis</Label>
                <Input type="text" ref={passwordRef} name="password" className="w-full bg-lightest-blue bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:border-blue focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow-lg" placeholder="Įveskite slaptąžodį" />
            </Field>

            <div className="flex gap-4 mt-8">
                <button className="pl-4 pr-4 pt-1 pb-2 text-center bg-lightest-blue border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors"  
                    onClick={() => submit()}>Registruotis
                </button>
            </div>
        </div>
        </>

    );
}

export default Register;
