import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="overflow-hidden self-center px-8 pt-8 pb-14 mt-6 w-full bg-white rounded shadow-sm max-w-[1217px] max-md:px-5 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col items-start self-stretch my-auto text-base text-black max-md:mt-10 max-md:max-w-full">
            <h1 className="text-4xl font-bold leading-none max-md:max-w-full">
              Empowering Women in Kigali
            </h1>
            <p className="self-stretch mt-5 leading-6 max-md:max-w-full">
              Join our platform to access resources, connect with events, and
              find job opportunities tailored for women in Kigali.
            </p>
            <button className="px-4 py-1.5 mt-4 text-black bg-purple-600 rounded">
              Get Started
            </button>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/f569a82b342b4a878c48adbe8885da1d/e59c1037cd038f099b4c2b056a7b68f68a797fa2c5b6070239d13352ee42cae7?apiKey=f569a82b342b4a878c48adbe8885da1d&"
            alt="Women empowerment illustration"
            className="object-contain grow w-full rounded-xl aspect-[2.01] max-md:mt-10 max-md:max-w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
