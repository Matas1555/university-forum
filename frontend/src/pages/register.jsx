import React, { useEffect, useRef, useState } from "react";
import { Label, Input, Field, Textarea, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { ChevronDownIcon, CheckIcon, ArrowRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import API from "../utils/API";
import { useStateContext } from "../context/contextProvider";
import { useNavigate } from "react-router-dom";
import Datepicker from "tailwind-datepicker-react";

function Register() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [bio, setBio] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    

    const usernameRef = useRef();
    const fullNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const bioRef = useRef();
    const graduationYearRef = useRef();
    const fileInputRef = useRef();

    const [step, setStep] = useState(1);
    const [isStudent, setIsStudent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [universities, setUniversities] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [academicStatuses, setAcademicStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [selectedAcademicStatus, setSelectedAcademicStatus] = useState(null);
    const [avatar, setAvatar] = useState(null);

    const [errors, setErrors] = useState({});
    const [formSubmitted, setFormSubmitted] = useState(false);

    const navigate = useNavigate();
    const { setUser, setToken, setRefreshToken } = useStateContext();

    useEffect(() => {
        setIsLoading(true);

        const fetchData = async () => {
          try {
            const [universitiesResponse, statusesResponse] = await Promise.all([
              API.get('/universities'),
              API.get('/statuses'),
            ]);
      
            setUniversities(universitiesResponse.data);
                setAcademicStatuses(statusesResponse.data);
          } catch (error) {
            console.error("Error fetching data", error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchData();
    }, []);

    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/\d/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        
        setPasswordStrength(strength);
    }, [password]);

    useEffect(() => {
        if (!passwordConfirm) {
            setPasswordMatch(true);
            return;
        }
        
        setPasswordMatch(password === passwordConfirm);
    }, [password, passwordConfirm]);

    const handleUniversityChange = (university) => {
        setSelectedUniversity(university);
        setSelectedFaculty(null);
        setSelectedProgram(null);

        if (university) {
            API.get(`/universities/${university.id}/faculties`)
                .then(response => {
                    setFaculties(response.data);
                })
                .catch(error => {
                    console.error("Error fetching faculties", error);
                });
        } else {
            setFaculties([]);
        }
    };

    const handleFacultyChange = (faculty) => {
        setSelectedFaculty(faculty);
        setSelectedProgram(null);

        if (faculty) {
            API.get(`/faculties/${faculty.id}/programs`)
                .then(response => {
            setPrograms(response.data); 
        })
                .catch(error => {
                    console.error("Error fetching programs", error);
                });
        } else {
            setPrograms([]);
    }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setAvatar(file);
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const nextStep = () => {
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        
        if (currentStep === 1) {
            if (!username) newErrors.username = "Slapyvardis yra privalomas";
            if (!email) newErrors.email = "El. paštas yra privalomas";
            else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Neteisingas el. pašto formatas";
            
            if (!password) newErrors.password = "Slaptažodis yra privalomas";
            else if (passwordStrength < 1) newErrors.password = "Slaptažodis per silpnas";
            
            if (password !== passwordConfirm) {
                newErrors.passwordConfirm = "Slaptažodžiai nesutampa";
            }
        }
        
        if (currentStep === 2 && isStudent) {
            if (!selectedUniversity) newErrors.university = "Universitetas yra privalomas";
            if (!selectedAcademicStatus) newErrors.academicStatus = "Statusas yra privalomas";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateStep(step)) return;
        
        if (step < (isStudent ? 3 : 2)) {
            nextStep();
            return;
        }
        
        if (!termsAccepted) {
            setErrors({...errors, terms: "Turite sutikti su naudojimosi sąlygomis"});
            return;
        }
        
        setFormSubmitted(true);
        
        try {
            if (!username || !email || !password) {
                setFormSubmitted(false);
                setErrors({general: "Užpildykite visus privalomus laukus."});
                return;
            }
            
            const formData = new FormData();
            formData.append("username", username);
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("password_confirmation", passwordConfirm);
            formData.append("isStudent", isStudent);
            
            if (isStudent) {
                formData.append("university", selectedUniversity ? selectedUniversity.id : "");
                formData.append("faculty", selectedFaculty ? selectedFaculty.id : "");
                formData.append("program", selectedProgram ? selectedProgram.id : "");
                formData.append("status_id", selectedAcademicStatus ? selectedAcademicStatus.id : "");
                formData.append("yearOfGraduation", graduationYear);
            }
            
            formData.append("bio", bio);
    
            if (avatar) {
                formData.append("avatar", avatar);
            }
    
            const response = await API.post("/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.data.user && response.data.access_token && response.data.refresh_token) {
                setUser(response.data.user);
                setToken(response.data.access_token);
                setRefreshToken(response.data.refresh_token);
                navigate("/");
            } else {
                console.error("Unexpected response format", response);
                setFormSubmitted(false);
            }
        } catch (error) {
            console.error("Registration failed", error.response?.data.errors || error.message);
            setFormSubmitted(false);
            
            if (error.response?.data.errors) {
                const backendErrors = {};
                Object.entries(error.response.data.errors).forEach(([key, messages]) => {
                    backendErrors[key] = Array.isArray(messages) ? messages[0] : messages;
                });
                setErrors(backendErrors);
            } else if (error.response?.data.error) {
                setErrors({general: error.response.data.error});
            } else {
                setErrors({general: "Registracija nepavyko. Bandykite dar kartą."});
            }
        }
    };

    const ErrorMessage = ({ message }) => (
        message ? <p className="text-red text-xs mt-1">{message}</p> : null
    );


    // Step 1: Basic Information
    const renderBasicInfoStep = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Pagrindinė informacija</h2>
            
            <Field>
                <Label className="text-white mb-2">Slapyvardis*</Label>
                <Input 
                    type="text" 
                    ref={usernameRef} 
                    name="username" 
                    className="w-full bg-dark/20  placeholder:text-light-grey text-white text-sm border border-light-grey rounded-md px-3 py-2 transition duration-300 ease focus:border-lght-blue focus:outline-none hover:border-lght-blue shadow-sm" 
                    placeholder="Įveskite vardą, kurį matys kiti naudotojai" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <ErrorMessage message={errors.username} />
                </Field>

            <Field>
                <Label className="text-white mb-2">Pilnas vardas (neprivaloma)</Label>
                <Input 
                    type="text" 
                    ref={fullNameRef} 
                    name="fullName" 
                    className="w-full bg-dark/20  placeholder:text-light-grey text-white text-sm border border-light-grey rounded-md px-3 py-2 transition duration-300 ease focus:border-lght-blue focus:outline-none hover:border-lght-blue shadow-sm" 
                    placeholder="Įveskite savo pilną vardą" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
                </Field>

            <Field>
                <Label className="text-white mb-2">El. paštas*</Label>
                <Input 
                    type="email" 
                    ref={emailRef} 
                    name="email" 
                    className="w-full bg-dark/20  placeholder:text-light-grey text-white text-sm border border-light-grey rounded-md px-3 py-2 transition duration-300 ease focus:border-lght-blue focus:outline-none hover:border-lght-blue shadow-sm" 
                    placeholder="Įveskite el. paštą" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <ErrorMessage message={errors.email} />
                </Field>

            <Field>
                <Label className="text-white mb-2">Slaptažodis*</Label>
                <div className="relative">
                    <Input 
                        type={showPassword ? "text" : "password"} 
                        ref={passwordRef} 
                        name="password" 
                        className="w-full bg-dark/20 bg-transparent placeholder:text-light-grey text-white text-sm border border-light-grey rounded-md px-3 py-2 pr-10 transition duration-300 ease focus:border-lght-blue focus:outline-none hover:border-lght-blue shadow-sm" 
                        placeholder="Sukurkite slaptažodį" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="button"
                        className="absolute right-3 top-2 text-light-grey hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>

                <p className="text-xs text-light-grey mt-1">Slaptažodis turi būti bent 8 simbolių ir turėti skaičių bei didžiąją raidę</p>
                <ErrorMessage message={errors.password} />
            </Field>
            
            <Field>
                <Label className="text-white mb-2">Pakartokite slaptažodį*</Label>
                <div className="relative">
                    <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        ref={passwordConfirmRef} 
                        name="passwordConfirm" 
                        className={`w-full bg-dark/20 bg-transparent placeholder:text-light-grey text-white text-sm border ${!passwordMatch && passwordConfirm ? 'border-red-500' : 'border-light-grey'} rounded-md px-3 py-2 pr-10 transition duration-300 ease focus:border-lght-blue focus:outline-none hover:border-lght-blue shadow-sm`}
                        placeholder="Pakartokite slaptažodį" 
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    <button 
                        type="button"
                        className="absolute right-3 top-2 text-light-grey hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                            <EyeIcon className="h-5 w-5" />
                        )}
                    </button>
                </div>
                {!passwordMatch && passwordConfirm && (
                    <p className="text-red text-xs mt-1">Slaptažodžiai nesutampa</p>
                )}
                {/* <ErrorMessage message={errors.passwordConfirm} /> */}
            </Field>
            
            <div className="flex items-center mt-6">
                <input
                    id="is-student"
                    name="is-student"
                    type="checkbox"
                    checked={isStudent}
                    onChange={() => setIsStudent(!isStudent)}
                    className="h-4 w-4 rounded border-light-grey bg-dark text-lght-blue focus:ring-lght-blue cursor-pointer"
                />
                <label htmlFor="is-student" className="ml-2 block text-sm text-white cursor-pointer">
                    Aš esu studentas/universiteto narys
                </label>
            </div>
            
            <div className="flex justify-end mt-10">
                <button 
                    type="button" 
                    className="flex items-center gap-2 px-4 py-2 bg-lght-blue text-white rounded-md hover:bg-dark transition-colors"
                    onClick={() => {
                        if (validateStep(1)) nextStep();
                    }}
                >
                    Tęsti
                    <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    // Step 2: Academic Information (only shown if isStudent is true)
    const renderAcademicInfoStep = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Akademinė informacija</h2>
            
            <Field>
                <Label className="text-white mb-2">Universitetas*</Label>
                <Listbox value={selectedUniversity} onChange={handleUniversityChange}>
                    <div className="relative">
                        <ListboxButton className="relative w-full rounded-md bg-dark/20 border border-light-grey py-2 pl-3 pr-10 text-left text-white text-sm shadow-sm">
                            <span>{selectedUniversity ? selectedUniversity.name : "Pasirinkite universitetą"}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon className="h-5 w-5 text-light-grey" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark py-1 px-1 text-base shadow-lg ring-1 ring-light-grey focus:outline-none sm:text-sm">
                            {universities.map((university) => (
                                <ListboxOption
                                    key={university.id}
                                    value={university}
                                    className={({ active }) =>
                                        `${active ? 'text-white bg-grey' : 'text-light-grey'}
                                        cursor-default select-none relative py-2 pl-10 pr-4`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                {university.name}
                                            </span>
                                            {selected && (
                                                <span className={`${active ? 'text-white' : 'text-lght-blue'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                    </Listbox>
                <ErrorMessage message={errors.university} />
            </Field>
            
            <Field>
                <Label className="text-white mb-2">Fakultetas (neprivaloma)</Label>
                <Listbox value={selectedFaculty} onChange={handleFacultyChange} disabled={!selectedUniversity}>
                    <div className="relative">
                        <ListboxButton className={`relative w-full rounded-md ${!selectedUniversity ? 'bg-grey/50 cursor-not-allowed' : 'bg-dark/20'} border border-light-grey py-2 pl-3 pr-10 text-left text-white text-sm shadow-sm`}>
                            <span>{selectedFaculty ? selectedFaculty.name : "Pasirinkite fakultetą"}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon className="h-5 w-5 text-light-grey" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        {selectedUniversity && (
                            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark py-1 px-1 text-base shadow-lg ring-1 ring-light-grey focus:outline-none sm:text-sm">
                                {faculties.length > 0 ? (
                                    faculties.map((faculty) => (
                                        <ListboxOption
                                            key={faculty.id}
                                            value={faculty}
                                            className={({ active }) =>
                                                `${active ? 'text-white bg-grey' : 'text-light-grey'}
                                                cursor-default select-none relative py-2 pl-10 pr-4`
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                        {faculty.name}
                                                    </span>
                                                    {selected && (
                                                        <span className={`${active ? 'text-white' : 'text-lght-blue'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </ListboxOption>
                                    ))
                                ) : (
                                    <div className="py-2 px-4 text-light-grey">Nėra fakultetų</div>
                                )}
                            </ListboxOptions>
                        )}
                    </div>
                </Listbox>
            </Field>
            
            <Field>
                <Label className="text-white mb-2">Programa (neprivaloma)</Label>
                <Listbox value={selectedProgram} onChange={setSelectedProgram} disabled={!selectedFaculty}>
                    <div className="relative">
                        <ListboxButton className={`relative w-full rounded-md ${!selectedFaculty ? 'bg-grey/50 cursor-not-allowed' : 'bg-dark/20'} border border-light-grey py-2 pl-3 pr-10 text-left text-white text-sm shadow-sm`}>
                            <span>{selectedProgram ? selectedProgram.title : "Pasirinkite programą"}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon className="h-5 w-5 text-light-grey" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        {selectedFaculty && (
                            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark py-1 px-1 text-base shadow-lg ring-1 ring-light-grey focus:outline-none sm:text-sm">
                                {programs.length > 0 ? (
                                    programs.map((program) => (
                                        <ListboxOption
                                            key={program.id}
                                            value={program}
                                            className={({ active }) =>
                                                `${active ? 'text-white bg-grey' : 'text-light-grey'}
                                                cursor-default select-none relative py-2 pl-10 pr-4`
                                            }
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                        {program.title}
                                                    </span>
                                                    {selected && (
                                                        <span className={`${active ? 'text-white' : 'text-lght-blue'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </ListboxOption>
                                    ))
                                ) : (
                                    <div className="py-2 px-4 text-light-grey">Nėra programų</div>
                                )}
                            </ListboxOptions>
                        )}
                    </div>
                </Listbox>
            </Field>
            
            <Field>
                <Label className="text-white mb-2">Akademinis statusas*</Label>
                <Listbox value={selectedAcademicStatus} onChange={setSelectedAcademicStatus}>
                    <div className="relative">
                        <ListboxButton className="relative w-full rounded-md bg-dark/20 border border-light-grey py-2 pl-3 pr-10 text-left text-white text-sm shadow-sm">
                            <span>{selectedAcademicStatus ? selectedAcademicStatus.name : "Pasirinkite statusą"}</span>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon className="h-5 w-5 text-light-grey" aria-hidden="true" />
                            </span>
                        </ListboxButton>
                        <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark py-1 px-1 text-base shadow-lg ring-1 ring-light-grey focus:outline-none sm:text-sm">
                            {academicStatuses.map((status) => (
                                <ListboxOption
                                    key={status.id}
                                    value={status}
                                    className={({ active }) =>
                                        `${active ? 'text-white bg-grey' : 'text-light-grey'}
                                        cursor-default select-none relative py-2 pl-10 pr-4`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                {status.name}
                                            </span>
                                            {selected && (
                                                <span className={`${active ? 'text-white' : 'text-lght-blue'} absolute inset-y-0 left-0 flex items-center pl-3`}>
                                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            )}
                                        </>
                                    )}
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                    </Listbox>
                <ErrorMessage message={errors.academicStatus} />
            </Field>
            
            <Field>
                <Label className="text-white mb-2">Baigimo metai (neprivaloma)</Label>
                <Input 
                    type="number" 
                    ref={graduationYearRef} 
                    name="graduationYear" 
                    className="w-full bg-dark/20 bg-transparent placeholder:text-light-grey text-white text-sm border border-light-grey rounded-md px-3 py-2 transition duration-300 ease focus:border-lght-blue focus:outline-none hover:border-lght-blue shadow-sm" 
                    placeholder="Įveskite metus"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                />
            </Field>
            
            <div className="flex justify-between mt-10">
                <button 
                    type="button" 
                    className="px-4 py-2 border border-light-grey text-white rounded-md hover:bg-dark transition-colors"
                    onClick={prevStep}
                >
                    Atgal
                </button>
                <button 
                    type="button" 
                    className="flex items-center gap-2 px-4 py-2 bg-lght-blue text-white rounded-md hover:bg-dark transition-colors"
                    onClick={() => {
                        if (validateStep(2)) nextStep();
                    }}
                >
                    Tęsti
                    <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    // Step 3: Profile Information
    const renderProfileInfoStep = () => (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Profilio informacija</h2>
            
            <Field>
                <Label className="text-white mb-2">Aprašymas apie jus (neprivaloma)</Label>
                <Textarea 
                    ref={bioRef} 
                    name="bio" 
                    className="w-full bg-dark/20 bg-transparent placeholder:text-light-grey text-white text-sm border border-light-grey rounded-md px-3 py-2 min-h-[100px] transition duration-300 ease focus:border-lght-blue focus:outline-none hover:border-lght-blue shadow-sm" 
                    placeholder="Papasakokite apie save..." 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                </Field>

            <Field>
                <Label className="text-white mb-2">Profilio nuotrauka (neprivaloma)</Label>
                <div className="flex items-center gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <button 
                        type="button"
                        onClick={handleUploadClick}
                        className="px-4 py-2 bg-dark text-white border border-light-grey rounded-md hover:border-lght-blue hover:text-lght-blue transition-colors"
                    >
                        Pasirinkti nuotrauką
                    </button>
                    {avatar && (
                        <span className="text-sm text-light-grey">{avatar.name}</span>
                    )}
                </div>
                {avatar && (
                    <div className="mt-4">
                        <img 
                            src={URL.createObjectURL(avatar)} 
                            alt="Preview" 
                            className="h-20 w-20 object-cover rounded-full border border-light-grey" 
                        />
                    </div>
                )}
                </Field>

            <div className="flex items-center mt-6">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={() => setTermsAccepted(!termsAccepted)}
                    className="h-4 w-4 rounded bg-dark border-light-grey text-lght-blue focus:ring-lght-blue cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-white cursor-pointer">
                    Sutinku su <a href="#" className="text-lght-blue underline">naudojimosi sąlygomis</a> ir <a href="#" className="text-lght-blue underline">privatumo politika</a>
                </label>
            </div>
            <ErrorMessage message={errors.terms} />
            
            <div className="flex justify-between mt-10">
                <button 
                    type="button" 
                    className="px-4 py-2 border border-light-grey text-white rounded-md hover:bg-dark transition-colors"
                    onClick={prevStep}
                >
                    Atgal
                </button>
                <button 
                    type="button" 
                    className="flex items-center gap-2 px-4 py-2 bg-lght-blue text-white rounded-md hover:bg-dark transition-colors"
                    onClick={handleSubmit}
                    disabled={formSubmitted}
                >
                    {formSubmitted ? (
                        <>
                            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                            Registruojama...
                        </>
                    ) : (
                        "Registruotis"
                    )}
                    </button>
            </div>
        </div>
    );

    const renderProgressIndicator = () => {
        const totalSteps = isStudent ? 3 : 2;
        
        return (
            <div className="mb-10">
                <div className="flex items-center justify-between">
                    {Array.from({ length: totalSteps }).map((_, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                    step > index + 1 ? 'bg-green' :
                                    step === index + 1 ? 'bg-lght-blue' : 'bg-grey'
                                } text-white font-medium`}>
                                    {step > index + 1 ? (
                                        <CheckIcon className="h-6 w-6" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span className="text-sm mt-2 text-white">
                                    {index === 0 ? 'Pagrindinė informacija' : 
                                     index === 1 && isStudent ? 'Akademinė informacija' : 'Profilio informacija'}
                                </span>
                            </div>
                            
                            {index < totalSteps - 1 && (
                                <div className={`flex-1 h-[2px] mx-6 ${step > index + 1 ? 'bg-green' : 'bg-grey'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
        <div className="relative">
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-20 right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-lght-blue/30 to-lght-blue/5 blur-3xl opacity-50 transform rotate-12"></div>
                
                <div className="absolute top-60 -left-20 w-[500px] h-[500px]">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lght-blue/20 to-lght-blue/5 blur-3xl opacity-60"></div>
                </div>
                
                <div className="absolute bottom-40 right-10 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-lght-blue/10 to-grey/30 blur-3xl opacity-40"></div>
                
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
                </div>

            </div>
        
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="w-10 h-10 border-4 border-lght-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="container max-w-2xl mx-auto px-4 py-16 mb-28 min-h-[calc(100vh-6rem)] relative">
                    <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold text-lght-blue mb-2">Prisijunkite prie akademinės bendruomenės</h1>
                        <p className="text-light-grey">Ačiū, kad padedate kurti geresnę studijų aplinką</p>
                    </div>
                    
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red/10 border border-red rounded-md text-red text-center">
                            {errors.general}
                        </div>
                    )}
                    
                    {renderProgressIndicator()}
                    
                    <div className="bg-grey rounded-lg shadow-md p-8 md:p-10 border border-light-grey/30 backdrop-blur-sm bg-opacity-80">
                        {step === 1 && renderBasicInfoStep()}
                        {step === 2 && isStudent && renderAcademicInfoStep()}
                        {step === (isStudent ? 3 : 2) && renderProfileInfoStep()}
                    </div>
                </div>
            )}
        </div>
        </>
    );
}

export default Register;
