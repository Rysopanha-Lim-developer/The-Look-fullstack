"use client"

import { useState, useEffect } from "react";
import type { userPersonalInfo } from "@/app/lib/Types/generalTypes.module";


export function UserPersonalDataForm(){
    let [firstname, setFirstname] = useState("");
    let [lastname, setLastname] = useState("");
    let [gender, setGender] = useState("");
    let [cityNprovince, setCityNprovince] = useState("");
    let [district, setDistrict] = useState("");
    let [communce, setCommune] = useState("");
    let [street, setStreet] = useState("");
    let [telephone, setTelephone] = useState("");

    function handleFirstname(e:any){
        setFirstname(e.target.value);
    }
    function handleLastname(e:any){
        setLastname(e.target.value);
    }
    function handleGender(e:any){
        setGender(e.target.value);
    }
    function handleCityNProvince(e:any){
        setCityNprovince(e.target.value);
    }
    function handleDistrict(e:any){
        setDistrict(e.target.value);
    }
    function handleCommune(e:any){
        setCommune(e.target.value);
    }
    function handleStreet(e:any){
        setStreet(e.target.value);
    }
    function handleTelephone(e:any){
        setTelephone(e.target.value);
    }

    function StoreUserPersonalData(e:React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();
        const personalData:userPersonalInfo = {
            firstname,
            lastname,
            gender,
            cityNprovince, 
            district,
            communce,
            street,
            telephone
        }
        
        localStorage.setItem("personal-data", JSON.stringify(personalData))
    }
    return(<>
        <h3 className="underline">Personal Information</h3>
        <form className="flex flex-col w-full ml-2 gap-y-2.5" onSubmit={StoreUserPersonalData}>
            <div className="flex w-full items-center justify-evenly">
                <div className="flex flex-col w-[50%]">
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" name="firstname" className="w-[90%] rounded-lg" value={firstname} onChange={handleFirstname} />
                </div>
                <div className="flex flex-col w-[50%]">
                    <label htmlFor="lastname">Last Name</label>
                    <input type="text" name="lastname" className="w-[90%] rounded-lg" value={lastname} onChange={handleLastname} />
                </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
                <label>Gender</label>
                <div className="flex gap-x-1.5">
                    <div>
                        <input type="radio" id="gender-male" name="gender" value="male" checked={gender === "male"} onChange={handleGender} />
                        <label htmlFor="gender-male">Male</label>
                    </div>
                    <div>
                        <input type="radio" id="gender-female" name="gender" value="female" checked={gender === "female"} onChange={handleGender} />
                        <label htmlFor="gender-female">Female</label>
                    </div>
                    <div>
                        <input type="radio" id="gender-notsay" name="gender" value="none" checked={gender === "none"} onChange={handleGender} />
                        <label htmlFor="gender-notsay">Prefer not to say</label>
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center justify-evenly">
                <div className="flex flex-col w-[50%]">
                    <label htmlFor="city-province">City/Province(Cambodia)</label>
                    <input type="text" name="city-province" className="w-[90%] rounded-lg" value={cityNprovince} onChange={handleCityNProvince} />
                </div>
                <div className="flex flex-col w-[50%]">
                    <label htmlFor="district">District</label>
                    <input type="text" name="district" className="w-[90%] rounded-lg" value={district} onChange={handleDistrict} />
                </div>
            </div>
            <div className="flex w-full items-center justify-evenly">
                
                <div className="flex flex-col w-[50%]">
                    <label htmlFor="communce">Communce</label>
                    <input type="text" name="communce" className="w-[90%] rounded-lg" value={communce} onChange={handleCommune} />
                </div>
                <div className="flex flex-col w-[50%]">
                    <label htmlFor="street">Street</label>
                    <input type="text" name="street" className="w-[90%] rounded-lg" value={street}  onChange={handleStreet}/>
                </div>
            </div>
            <div className="flex flex-col w-[50%] items-start justify-start">
                <label htmlFor="telephone">Tel</label>
                <input type="tel" name="telephone" className="w-[90%] rounded-lg" value={telephone} onChange={handleTelephone} />
            </div>
            <button className="btn w-[20%]" type="submit">
                Save
            </button>
        </form>
    </>)
}