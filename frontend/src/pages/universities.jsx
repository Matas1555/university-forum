import React from 'react';
import UniversityList from '../components/lists/universityList';

const UniversitiesPage = () => {
  return (
    <div className="max-w-10/12 w-10/12 mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-dark to-grey rounded-lg border-l-2 border-lght-blue shadow-lg overflow-hidden mb-10">
        <div className="p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-5 right-5 w-40 h-40 bg-lght-blue/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-5 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
          
          {/* Header content */}
          <div className="flex flex-row gap-4 relative z-10 w-full">
            <div className='w-8/12 space-y-10'>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-lght-blue/20 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                </div>
                <h1 className="text-white text-4xl font-bold">Lietuvos universitetai</h1>
              </div>
              
              <p className="text-light-grey leading-relaxed mb-6">
                Šiame puslapyje rasite išsamią informaciją apie visus Lietuvos universitetus, jų fakultetus bei siūlomas studijų programas.
                Kiekvienas universitetas turi savo unikalią istoriją, tradicijas ir stipriąsias puses – visa tai rasite žemiau pateiktame sąraše.
              </p>

              <p className="text-white font-medium">Pasirinkite universitetą žemiau, kad sužinotumėte daugiau!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="bg-dark/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <h3 className="text-white font-semibold">Išsami informacija</h3>
                </div>
                <p className="text-light-grey text-sm">Peržiūrėkite studijų programas, fakultetus ir kontaktinius duomenis viename puslapyje.</p>
              </div>
              
              <div className="bg-dark/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                  </svg>
                  <h3 className="text-white font-semibold">Studentų atsiliepimai</h3>
                </div>
                <p className="text-light-grey text-sm">Skaitykite autentiškus atsiliepimus apie studijų kokybę, fakultetus ir programas.</p>
              </div>
              
              <div className="bg-dark/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  <h3 className="text-white font-semibold">Diskusijų forumai</h3>
                </div>
                <p className="text-light-grey text-sm">Prisijunkite prie diskusijų su esamais ir buvusiais studentais apie studijų patirtį.</p>
              </div>
              
              <div className="bg-dark/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                  </svg>
                  <h3 className="text-white font-semibold">Reitingai ir statistika</h3>
                </div>
                <p className="text-light-grey text-sm">Palyginkite universitetus pagal įvairius kriterijus ir reitingų sistemą.</p>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>
      
      <UniversityList />
    </div>
  );
};

export default UniversitiesPage;
