import {React, useState} from 'react';
import { useStateContext } from "../context/contextProvider";
import API from "../utils/API";
import KTU from "../../public/assets/KTU.jpg";
import KTU_logo from "../../public/assets/KTU-logo.png";
import VU from "../../public/assets/VU.jpg";
import StarRating from "../components/starRating";

const University = () => {
    const {user} = useStateContext();
    const [stojimaiActive, setStojimaiActive] = useState(true);
    const [moduliaiActive, setModuliaiActive] = useState(false);
    const [atsiliepimaiActive, setAtsiliepimaiActive] = useState(false);

    const handleShowStojimas = () => {
        setStojimaiActive(!stojimaiActive);
        setModuliaiActive(false);
        setAtsiliepimaiActive(false);
    }

    const handleShowModuliai = () => {
        setModuliaiActive(!moduliaiActive);
        setAtsiliepimaiActive(false);
        setStojimaiActive(false);
    }

    const handleShowAtsilipimai = () => {
        setAtsiliepimaiActive(!atsiliepimaiActive);
        setModuliaiActive(false);
        setStojimaiActive(false);
    }

    return (
        <>
            <div className="m-10">
                <div className="flex flex-row gap-10 w-full content-center justify-center border-t-2 border-b-2 p-10 border-light-grey">
                    <img className="size-24" src={KTU_logo}/>
                    <div className="">
                        <h1 className="text-white font-bold text-2xl">Kauno Technologijos Universitetas</h1>
                    </div>
                </div>

                <div className="flex flex-row mt-20 gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                    </svg>
                    <h1 className="text-white font-medium">Programų informacija</h1>
                </div>

                <div className="mt-5 rounded-md bg-grey p-4 ">
                    <div className="flex justify-between mb-6">
                        <h1 className="font-bold text-white">Pasirinkite fakultetą</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    
                    <div className="max-h-80 overflow-auto scrollbar-custom">
                        
                        <div className="flex fles-row gap-2 mr-2 p-2 py-4 border-dark bg-blue rounded-md">
                            <div>
                                <div className="flex justify-center bg-lght-blue px-4 text-white rounded-md max-w-14 min-w-14">IF</div>
                            </div>
                            <h1 className="text-white font-medium">Informatikos fakultetas</h1>
                        </div>
                        <div className="flex fles-row gap-2 mr-2 border-t-[1px] p-2 py-4 border-dark">
                            <div>
                                <div className="flex justify-center bg-red px-4 text-white rounded-md max-w-14 min-w-14">CF</div>
                            </div>
                            <h1 className="text-white font-medium">Cheminės technologijos fakultetas</h1>
                        </div>
                        <div className="flex fles-row gap-2 p-2 py-4 mr-2 border-t-[1px] border-dark">
                            <div>
                                <div className="flex justify-center bg-purple px-4 text-white rounded-md max-w-14 min-w-14">EEF</div>
                            </div>
                            <h1 className="text-white font-medium">Elektros ir elektronikos fakultetas</h1>
                        </div>
                        <div className="flex fles-row gap-2 p-2 py-4 mr-2 border-t-[1px] border-dark">
                            <div>
                                <div className="flex justify-center bg-green px-4 text-white rounded-md max-w-14 min-w-14">MGF</div>
                            </div>
                            <h1 className="text-white font-medium">Matematikos ir gamtos fakultetas</h1>
                        </div>
                        <div className="flex fles-row gap-2 p-2 py-4 mr-2 border-t-[1px] border-dark">
                            <div>
                                <div className="flex justify-center bg-orange px-4 text-white rounded-md max-w-14 min-w-14">EVF</div>
                            </div>
                            <h1 className="text-white font-medium">Ekonomikos ir verslo fakultetas</h1>
                        </div>
                        <div className="flex fles-row gap-2 p-2 py-4 mr-2 border-t-[1px] border-dark">
                            <div>
                                <div className="flex justify-center bg-blue px-4 text-white rounded-md max-w-14 min-w-14">SAF</div>
                            </div>
                            <h1 className="text-white font-medium">Statybos ir architektūros fakultetas</h1>
                        </div>
                    </div>
                </div>

                <div className="mt-5 rounded-md bg-grey p-4 ">
                    <div className="flex justify-between mb-6">
                        <h1 className="font-bold text-white mb-5">Pasirinkite programą</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <div className="flex flex-col max-h-80 overflow-auto scrollbar-custom">
                        <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                            <p className="text-sm text-white font-medium">Dirbtinis intelektas</p>
                            <StarRating rating={2.1} width={4}></StarRating>
                        </div>
                        <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                            <p className="text-sm text-white font-medium">Informacinės sistemos</p>
                            <StarRating rating={4.8} width={4}></StarRating>
                        </div>
                        <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                            <p className="text-sm text-white font-medium">Informatika</p>
                            <StarRating rating={4.2} width={4}></StarRating>
                        </div>
                        <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                            <p className="text-sm text-white font-medium">Informatikos inžinerija</p>
                            <StarRating rating={3.5} width={4}></StarRating>
                        </div>
                        <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                            <p className="text-sm text-white font-medium">Multimedijos technologijos</p>
                            <StarRating rating={3.1} width={4}></StarRating>
                        </div>
                        <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2  bg-blue rounded-md">
                            <p className="text-sm text-white font-medium">Programų sistemos</p>
                            <StarRating rating={5} width={4}></StarRating>
                        </div>
                        
                    </div>
                </div>

                <div className="flex flex-col justify-center mt-10 text-white">
                    <div className="flex justify-center mb-4">
                        <h1 className="text-white font-bold text-xl">Programų sistemos</h1>
                    </div>
                    
                    <div className="flex flex-col justify-center w-auto">
                        <table class="table-auto w-full">
                        <tbody>
                            <tr className="border-b-[1px] border-t-[1px]">
                                <td className="p-4">Kaina</td>
                                <td className="p-4 text-end">~4108€</td>
                            </tr>
                            <tr className="border-b-[1px] border-t-[1px]">
                                <td className="p-4">Trukmė</td>
                                <td className="p-4 text-end">4 metai</td>
                            </tr>
                            <tr className="border-b-[1px] border-t-[1px]">
                                <td className="p-4">Pakopa</td>
                                <td className="p-4 text-end">Bakalauro</td>
                            </tr>
                        </tbody>
                        </table>

                        <div className="flex flex-row justify-around mt-10">
                            <button className={` p-1 px-2 hover:text-lght-blue transition duration-150 ease-in
                                ${stojimaiActive ? "text-lght-blue border-b-2" : "text-white"}
                                `} 
                                onClick={handleShowStojimas}
                                >Stojimas</button>
                            <button className={` p-1 px-2 hover:text-lght-blue transition duration-150 ease-in
                                ${moduliaiActive ? "text-lght-blue border-b-2" : "text-white"}
                                `}
                                onClick={handleShowModuliai}
                                >Moduliai</button>
                            <button className={` p-1 px-2 hover:text-lght-blue transition duration-150 ease-in
                                ${atsiliepimaiActive ? "text-lght-blue border-b-2" : "text-white"}
                                `}
                                onClick={handleShowAtsilipimai}>Atsiliepimai</button>
                        </div>

                        {stojimaiActive && (
                            <div className="mt-10">
                            <h1 className="font-bold">1. Stojimo informacija</h1>
                            <h2 className="ml-2 font-medium">1.2. Minimalus reikalavimai VF</h2>
                            <ul className="ml-4">
                                <li>
                                    Išlaikyti trys valstybiniai brandos egzaminai: Lietuvių, Matematikos ir laisvai pasirenkamas
                                </li>
                            </ul>
                        </div>
                        ) }

                    {moduliaiActive && (
                        <>
                        <div className="mt-5 rounded-md bg-grey p-4 ">
                            <div className="flex justify-between mb-6">
                                <h1 className="font-bold text-white mb-5">Pasirikite semestrą</h1>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                            <div className="flex flex-col max-h-80 overflow-auto scrollbar-custom">
                                <div className="flex flex-row justify-center items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                    <p className="text-lg text-white font-medium">1 semestras</p>
                                </div>
                                <div className="flex flex-row justify-center items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                    <p className="text-lg text-white font-medium">2 semestras</p>
                                </div>
                                <div className="flex flex-row justify-center items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                    <p className="text-lg text-white font-medium">3 semestras</p>
                                </div>
                                <div className="flex flex-row justify-center items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                    <p className="text-lg text-white font-medium">4 semestras</p>
                                </div>   
                            </div>
                        </div>
                        <div className="mt-5 rounded-md bg-grey p-4 ">
                            <div className="flex justify-between mb-6">
                                <h1 className="font-bold text-white mb-5">Pasirikite modulį</h1>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                            <div className="flex flex-col max-h-80 overflow-auto scrollbar-custom">
                            <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                <p className="text-sm text-white font-medium">Informatikos studijų įvadas</p>
                                <StarRating rating={2.1} width={4}></StarRating>
                                </div>
                                <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                    <p className="text-sm text-white font-medium">Kompiuterinė grafika</p>
                                    <StarRating rating={4.8} width={4}></StarRating>
                                </div>
                                <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                    <p className="text-sm text-white font-medium">Matematika 1</p>
                                    <StarRating rating={4.2} width={4}></StarRating>
                                </div>
                                <div className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                    <p className="text-sm text-white font-medium">Objektinis programavimas 1</p>
                                    <StarRating rating={3.5} width={4}></StarRating>
                                </div>
                            </div>
                        </div>    
                        </>
                    )}

                    {atsiliepimaiActive && (
                        <>

                        </>
                    )}
                    
                    </div>
                    </div>
            </div>
        </>
    );
  };
  
  export default University;