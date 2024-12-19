import { useStateContext } from "../context/contextProvider";
import API from "../API";
import KTU from "../../public/assets/KTU.jpg";
import KTU_logo from "../../public/assets/KTU-logo.png";

const University = () => {
    const {user} = useStateContext();

    return (
        <>
            <div>
                <div className="w-full h-96 relative overflow-hidden border-b-2 border-blue ">
                    <img
                        src={KTU}
                        alt="Background"
                        className="w-full h-full object-cover blur-sm transform scale-105 "
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center" style={{fontFamily: "Inter", fontWeight:800, fontSize:"2em", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"}}
                    >
                        <h1 className="text-lightest-blue text-3xl font-bold">UNIVERSITETO PAVADINIMAS</h1>
                    </div>
                </div>
                <div className="w-4/5 justify-center m-auto lg:flex lg:flex-col">
                    <div className="gap-10 mt-10 mb-10 justify-center lg:flex lg:flex-row">
                        <div className="h-96 border-2 mb-10 border-blue text-center lg:flex-[1]">
                            <p className="m-auto">Programos</p>
                        </div>
                        <div className="h-96 border-2  border-blue text-center lg:flex-grow">
                            <p>Universiteto informacija</p>
                        </div>
                    </div>
                    <div className="gap-10 mt-10 mb-10 justify-center lg:flex lg:flex-row">
                        <div className="h-96 border-2 mb-10 border-blue text-center lg:flex-[3]">
                            <p>Išsamesnė informacija apie pasirinkta programą</p>
                        </div>
                        <div className="h-96 border-2 border-blue text-center lg:flex-grow">
                            <p className="m-auto">Programos dėstytojai</p>
                        </div>
                    </div>
                    <div className="mt-20 text-left" style={{fontFamily: "Inter", fontWeight:500, fontSize:"1.5em"}}>
                        Kontaktai
                    </div>
                    <div className="gap-10 mt-10 flex flex-row">
                        <div className="text-left">
                        <p>
                            <b>Kauno technologijos universitetas</b>
                            <br></br>
                            įm. k. 111950581, PVM k. LT119505811
                            <br></br>
                            adresas K. Donelaičio g. 73, LT-44249 Kaunas
                            <br></br>
                            tel. +370 (37) 300 000, 300 421, faks. +370 (37) 324 144
                            <br></br>
                            el. p. ktu@ktu.lt
                        </p>
                        </div>
                        <div className="">
                            <img className="w-20 h-20" src={KTU_logo}></img>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
  };
  
  export default University;