import React from 'react';
import UniversityList from '../components/lists/universityList';

const UniversitiesPage = () => {
  return (
    <div className="max-w-10/12 w-10/12 mx-auto px-4 py-8">
      <div className='flex flex-col bg-grey p-4 gap-4 items-center justify-center mb-6 rounded-md'>
        <h1 className="text-white text-4xl font-bold mb-8 mt-6">Universitetai</h1>
        <p className="text-white mb-6 font-medium">Čia galite rasti visus Lietuvos universitetus, jų fakultetus ir programas. Taip pat, galite palikti atsiliepimą. Pasirinkite universitetą, kad pamatytumėte daugiau informacijos.</p>
      </div>
      <UniversityList />
    </div>
  );
};

export default UniversitiesPage;
