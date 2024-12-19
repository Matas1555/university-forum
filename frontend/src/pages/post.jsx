import { useStateContext } from "../context/contextProvider";
import API from "../API";
import profilePicture from "../../public/assets/profile-default-icon.png";

const Post = () => {
    const {user} = useStateContext();

    return (
        <>
            <div>
                <div className="w-4/5 border-2 border-blue rounded-md p-10 h-1/2 m-auto mt-20 shadow-md" style={{fontFamily: "Inter", fontWeight:400, fontSize:"1em"}}>
                    <div className="flex flex-col" >
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row gap-10 mb-10">
                                <img src={profilePicture} className="w-8 h-8 rounded-full">
                                </img>
                                <div>
                                    username
                                </div>
                            </div>
                            <div>
                                2024-12-12
                            </div>
                        </div>
                        <div className="font-semibold mb-2 text-lg">
                            Titulas
                        </div>
                        <div className="mb-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae ligula sodales, pharetra tortor id, ultrices lectus. Fusce dignissim consectetur arcu ac posuere. Nulla facilisi. Suspendisse posuere ipsum aliquam felis tincidunt varius. Morbi pellentesque vulputate suscipit. Aliquam quis tristique libero. Phasellus pharetra felis eget magna porta sodales. In commodo accumsan semper. Vivamus justo neque, imperdiet a luctus pulvinar, vestibulum vel urna.

Fusce felis dui, rhoncus quis enim ut, lacinia feugiat libero. Etiam in porta nulla. Vivamus at lorem scelerisque turpis convallis aliquam. Nunc at fringilla justo. Curabitur hendrerit fermentum purus pharetra euismod. In facilisis magna eget erat malesuada, at maximus risus ornare. Duis lectus leo, vehicula ut porta sed, vulputate eget nibh. Maecenas ac nisl posuere, ullamcorper velit nec, cursus dolor. Etiam accumsan dapibus efficitur.
                        </div>
                        <div className="mb-10">
                        Quisque elementum vestibulum feugiat. Donec risus tellus, facilisis elementum nibh et, laoreet condimentum ligula. In molestie eu ligula eu rutrum. Aliquam bibendum tellus semper pretium efficitur. Morbi sit amet neque tellus. Morbi at consectetur massa. Quisque arcu nisi, tristique et dictum vitae, sagittis sed lorem.

Pellentesque ullamcorper, lorem in molestie mattis, sem lectus lacinia quam, eu malesuada dui nibh ut nulla. Suspendisse at bibendum nunc, sed hendrerit odio. Nullam quis leo magna. Nullam luctus sodales varius. Proin id tristique nunc. Maecenas suscipit ante tellus, vel volutpat ante ultrices eu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas ornare, ex quis vehicula viverra, mauris diam accumsan quam, eu varius arcu felis eu diam. 
                        </div>
                        <div className="flex flex-row gap-10 mb-4">
                            <div className="flex flex-row gap-1 align-middle bg-lighter-blue p-2 rounded-md border-2 border-blue" style={{fontFamily: "Inter", fontWeight:500, fontSize:"1em"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                </svg>
                                 25
                            </div>
                            <div className="flex flex-row gap-1 align-middle bg-lighter-blue p-2 rounded-md border-2 border-blue" style={{fontFamily: "Inter", fontWeight:500, fontSize:"1em"}}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
                                </svg>
                                Dalintis
                            </div>
                        </div>
                        <div className="flex flex-row">
                            <input className="bg-lighter-blue border-2 border-blue rounded-md p-2 w-4/5" placeholder="Palikite komentarą"></input>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8 m-2 cursor-pointer">
                                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="w-4/5 border-2 border-blue rounded-md p-10 h-1/2 m-auto mt-20 shadow-md" style={{fontFamily: "Inter", fontWeight:400, fontSize:"1em"}}>
                <div className="flex flex-col" >
                        <div className="flex flex-row gap-5">
                            <img src={profilePicture} className="w-8 h-8 rounded-full">
                            </img>
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-between align-middle">
                                    <h2 className="font-semibold">
                                        username
                                    </h2>
                                    <p>2024-12-12</p>
                                </div>

                                <div className="mb-3 mt-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae ligula sodales, pharetra tortor id, ultrices lectus.<br></br> Fusce dignissim consectetur arcu ac posuere. Nulla facilisi. Suspendisse posuere ipsum aliquam felis tincidunt varius. Morbi pellentesque vulputate suscipit. Aliquam quis tristique libero. Phasellus pharetra felis eget magna porta sodales. In commodo accumsan semper. Vivamus justo neque, imperdiet a luctus pulvinar, vestibulum vel urna.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-4/5 border-2 border-blue rounded-md p-10 h-1/2 m-auto mt-20 shadow-md" style={{fontFamily: "Inter", fontWeight:400, fontSize:"1em"}}>
                <div className="flex flex-col" >
                        <div className="flex flex-row gap-5">
                            <img src={profilePicture} className="w-8 h-8 rounded-full">
                            </img>
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-between align-middle">
                                    <h2 className="font-semibold">
                                        username
                                    </h2>
                                    <p>2024-12-12</p>
                                </div>

                                <div className="mb-3 mt-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae ligula sodales, pharetra tortor id, ultrices lectus. Fusce dignissim consectetur arcu ac posuere. Nulla facilisi. Suspendisse posuere ipsum aliquam felis tincidunt varius. Morbi pellentesque vulputate suscipit. Aliquam quis tristique libero. Phasellus pharetra felis eget magna porta sodales. In commodo accumsan semper. Vivamus justo neque, imperdiet a luctus pulvinar, vestibulum vel urna.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-4/5 border-2 border-blue rounded-md p-10 h-1/2 m-auto mt-20 shadow-md" style={{fontFamily: "Inter", fontWeight:400, fontSize:"1em"}}>
                <div className="flex flex-col" >
                        <div className="flex flex-row gap-5">
                            <img src={profilePicture} className="w-8 h-8 rounded-full">
                            </img>
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-between align-middle">
                                    <h2 className="font-semibold">
                                        username
                                    </h2>
                                    <p>2024-12-12</p>
                                </div>

                                <div className="mb-3 mt-3">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae ligula sodales, pharetra tortor id, ultrices lectus. Fusce dignissim consectetur arcu ac posuere. Nulla facilisi. Suspendisse posuere ipsum aliquam felis tincidunt varius. Morbi pellentesque vulputate suscipit. Aliquam quis tristique libero. Phasellus pharetra felis eget magna porta sodales. In commodo accumsan semper. Vivamus justo neque, imperdiet a luctus pulvinar, vestibulum vel urna.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </>
    );
  };
  
  export default Post;