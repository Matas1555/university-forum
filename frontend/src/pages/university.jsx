import { useStateContext } from "../context/contextProvider";
import API from "../utils/API";
import KTU from "../../public/assets/KTU.jpg";
import KTU_logo from "../../public/assets/KTU-logo.png";
import VU from "../../public/assets/VU.jpg";

const University = () => {
    const {user} = useStateContext();

    return (
        <>
            <div className="m-10">
                <div className="flex flex-row gap-10 w-full content-center justify-center">
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

                <div className="mt-5 rounded-md bg-grey p-4">
                    <div>
                        <h1 className="font-bold text-white mb-5">Pasirinkite fakultetą</h1>
                        <div className="flex fles-row gap-2 border-t-[1px] p-2 border-dark">
                            <div className="bg-lght-blue px-4 text-white rounded-md">IF</div>
                            <h1 className="text-white font-medium">Informatikos fakultetas</h1>
                        </div>
                        <div className="flex fles-row gap-2 border-t-[1px] p-2 border-dark">
                            <div className="bg-lght-blue px-4 text-white rounded-md">IF</div>
                            <h1 className="text-white font-medium">Informatikos fakultetas</h1>
                        </div>
                        <div className="flex fles-row gap-2 border-t-[1px] p-2 border-dark">
                            <div className="bg-lght-blue px-4 text-white rounded-md">IF</div>
                            <h1 className="text-white font-medium">Informatikos fakultetas</h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
  };
  
  export default University;