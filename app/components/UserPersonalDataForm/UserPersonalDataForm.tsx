"use client"

export function UserPersonalDataForm(){
    return(<>
        <h3 className="underline">Personal Information</h3>
        <form className="flex flex-col w-full ml-2 gap-y-2.5">
            <div className="flex w-full items-center justify-evenly">
                <div className="flex flex-col w-[50%]">
                    <label htmlFor="firstname">First Name</label>
                    <input type="text" name="firstname" className="w-[90%]" />
                </div>
                <div className="flex flex-col w-[50%]">
                    <label htmlFor="lastname">Last Name</label>
                    <input type="text" name="lastname" className="w-[90%]" />
                </div>
            </div>
            <div className="flex w-full flex-col gap-y-2">
                <label>Gender</label>
                <div className="flex gap-x-1.5">
                    <div>
                        <input type="radio" id="gender-male" name="gender" value="male"/>
                        <label htmlFor="gender-male">Male</label>
                    </div>
                    <div>
                        <input type="radio" id="gender-female" name="gender" value="female" />
                        <label htmlFor="gender-female">Female</label>
                    </div>
                    <div>
                        <input type="radio" id="gender-notsay" name="gender" value="none" />
                        <label htmlFor="gender-notsay">Prefer not to say</label>
                    </div>
                </div>
            </div>
            <div className="flex w-full gap-x-2">
                <label htmlFor="telephone">Tel</label>
                <input type="tel" name="telephone" />
            </div>
            <button className="btn w-[20%]" type="submit">
                Save
            </button>
        </form>
    </>)
}