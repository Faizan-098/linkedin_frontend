import { Camera, X } from "lucide-react";
import dp from "../assets/profile.png";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cover from "../assets/cover.png";
import { setEditState, updateUserProfile } from "../redux/features/userSlice";
const EditProfile = () => {
  // import selector & dispatch
  const { userData, isLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // took reference
  const modalRef = useRef();

  // close model
  useEffect(() => {
    const closeEditModel = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        dispatch(setEditState(false));
      }
    };
    document.addEventListener("mousedown", closeEditModel);
    return () => document.removeEventListener("mousedown", closeEditModel);
  }, []);

  // edit profile state
  const [editProfileState, setEditProfileState] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    userName: userData?.userName || "",
    location: userData?.location || "",
    gender: userData?.gender || "",
    headline: userData?.headline || "",
    skills: userData?.skills || [],
    education: userData?.education || [],
    experience: userData?.experience || [],
    coverImage: userData?.coverImage || "",
    profileImage: userData?.profileImage || "",
  });

  /*=========== Edit Skill Logic ===========*/
  // newSkill state
  const [newSkill, setNewSkill] = useState("");

  // add skill function
  const addNewSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) {
      return alert("Invalid Value!");
    }
    if (newSkill && !editProfileState.skills.includes(newSkill.toUpperCase())) {
      setEditProfileState({
        ...editProfileState,
        skills: [...editProfileState.skills, newSkill.toUpperCase()],
      });
    } else {
      return alert("Already Exists!");
    }
    setNewSkill("");
  };

  // remove from skills
  const removeSkill = (skill) => {
    if (editProfileState.skills.includes(skill)) {
      const filteredSkills = editProfileState.skills.filter((s) => s !== skill);
      setEditProfileState({ ...editProfileState, skills: filteredSkills });
    }
  };


  /*=========== Edit Education Logic ===========*/
  // newEducation state
  const [newEducation, setNewEducation] = useState({
    collage: "",
    degree: "",
    fieldOfStudy: "",
  });

  const onChangeEducationHandler = (e) => {
    setNewEducation({ ...newEducation, [e.target.name]: e.target.value });
  };

  // add education function
  const addNewEducation = (e) => {
    e.preventDefault();
    const college = newEducation.collage.trim();
    const degree = newEducation.degree.trim();
    const fieldOfStudy = newEducation.fieldOfStudy.trim();
    if (!college || !degree || !fieldOfStudy) {
      return alert("Invalid Input Value!");
    }
    // update education property
    setEditProfileState({
      ...editProfileState,
      education: [...editProfileState.education, newEducation],
    });
    setNewEducation({
      collage: "",
      degree: "",
      fieldOfStudy: "",
    });
  };

  // remove-education
  const removeEducation = (edu) => {
    if (editProfileState.education.includes(edu)) {
      const filteredEducation = editProfileState.education.filter(
        (e) => e != edu
      );
      setEditProfileState({
        ...editProfileState,
        education: filteredEducation,
      });
    }
  };

  /*=========== Edit Experience Logic ===========*/

  // newExperience state
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
  });

  const onChangeExperienceHandler = (e) => {
    setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
  };

  // add experience function
  const addNewExperience = (e) => {
    e.preventDefault();
    const title = newExperience.title.trim();
    const company = newExperience.company.trim();
    const description = newExperience.description.trim();
    if (!title || !company || !description) {
      return alert("Invalid Input Value!");
    }
    // update experience property
    setEditProfileState({
      ...editProfileState,
      experience: [...editProfileState.experience, newExperience],
    });
    setNewExperience({
      title: "",
      company: "",
      description: "",
    });
  };

  // remove-experience
  const removeExperience = (edu) => {
    if (editProfileState.experience.includes(edu)) {
      const filteredExperience = editProfileState.experience.filter(
        (e) => e != edu
      );
      setEditProfileState({
        ...editProfileState,
        experience: filteredExperience,
      });
    }
  };

  // Edit Profile onchange handler
  const onchangeHandler = (e) => {
    setEditProfileState({
      ...editProfileState,
      [e.target.name]: e.target.value,
    });
  };

  // Image upload logic
  const [frontendProfileImage, setFrontendProfileImage] = useState(
    editProfileState?.profileImage || dp
  );
  const [frontendCoverImage, setFrontendCoverImage] = useState(
    editProfileState?.coverImage || cover
  );
  const profileImageRef = useRef();
  const coverImageRef = useRef();
  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFrontendProfileImage(url);
      // send to server
      setEditProfileState({ ...editProfileState, profileImage: file });
    }
  };
  const handleCoverImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFrontendCoverImage(url);
      // send to server
      setEditProfileState({ ...editProfileState, coverImage: file });
    }
  };

  // Edit Profile submit handler
  const onEditSubmitHandler = async () => {
    const formData = new FormData();
    formData.append("firstName", editProfileState.firstName);
    formData.append("lastName", editProfileState.lastName);
    formData.append("userName", editProfileState.userName);
    formData.append("gender", editProfileState.gender);
    formData.append("headline", editProfileState.headline);
    formData.append("location", editProfileState.location);
    formData.append("skills", JSON.stringify(editProfileState.skills));
    formData.append("education", JSON.stringify(editProfileState.education));
    formData.append("experience", JSON.stringify(editProfileState.experience));
    if (editProfileState.profileImage)
      formData.append("profileImage", editProfileState.profileImage);
    if (editProfileState.coverImage)
      formData.append("coverImage", editProfileState.coverImage);
    await dispatch(updateUserProfile(formData)).unwrap();
    dispatch(setEditState(false));
  };

  return (
    <div className="h-screen w-full px-5 fixed top-0 bg-gradient-to-b from-black/70 to-black/70 z-100 flex items-center justify-center">
      <div
        ref={modalRef}
        className="absolute max-w-[550px] w-[95%]   rounded-lg p-2 bg-[#FFF] shadow-[0_0px_3px_rgb(0,0,0,0.1)] border border-gray-300  overflow-hidden"
      >
        {/* profile */}
        <div className="h-[150px] rounded-lg w-full relative bg-black/50">
          <input
            onChange={handleCoverImage}
            ref={coverImageRef}
            type="file"
            hidden
            accept="image/*"
          />
          <img
            className="w-full h-full object-cover "
            src={frontendCoverImage}
          />
          {/* camera */}
          <div
            onClick={() => coverImageRef.current.click()}
            className=" cursor-pointer absolute top-3 right-3 hover:text-[#FFF] hover:bg-[#0A66C2] transition duration-200 text-[#0A66C2] p-1 rounded-full bg-gray-200 flex justify-center items-center"
          >
            <Camera size={20} />
          </div>
          {/* profile image */}
          <div
            onClick={() => profileImageRef.current.click()}
            className="absolute top-[55%] left-[6%] rounded-full border-2 border-[#FFF] w-[100px] h-[100px] bg-gray-200 overflow-hidden cursor-pointer"
          >
            <img src={frontendProfileImage} alt="profile" />
            <input
              onChange={handleProfileImage}
              ref={profileImageRef}
              type="file"
              hidden
              accept="image/*"
            />
          </div>
        </div>

        {/* form */}
        <div className="mt-12 flex flex-col gap-3 max-h-[350px] overflow-auto px-2">
          <input
            className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            value={editProfileState.firstName}
            onChange={onchangeHandler}
            type="text"
            name="firstName"
            placeholder="Firstname"
          />
          <input
            className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            value={editProfileState.lastName}
            onChange={onchangeHandler}
            type="text"
            name="lastName"
            placeholder="Lastname"
          />
          <input
            className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            value={editProfileState.userName}
            onChange={onchangeHandler}
            type="text"
            name="userName"
            placeholder="Username"
          />
          <input
            className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            value={editProfileState.location}
            onChange={onchangeHandler}
            type="text"
            name="location"
            placeholder="Location"
          />
          <input
            className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            value={editProfileState.gender}
            onChange={onchangeHandler}
            type="text"
            name="gender"
            placeholder="Gender"
          />
          <input
            className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
            value={editProfileState.headline}
            onChange={onchangeHandler}
            type="text"
            name="headline"
            placeholder="Headline"
          />

          {/* add-skills */}
          <h2 className="font-medium text-xl text-gray-800 mt-3">Add Skills</h2>
          {/* display skills */}
          <div className="flex gap-3 flex-wrap">
            {editProfileState?.skills?.length > 0 &&
              editProfileState?.skills?.map((skill) => (
                <div
                  key={skill}
                  className="rounded-full flex items-center gap-[2px] p-1 px-3 cursor-pointer ring-1 transition duration-200 ring-gray-200 hover:ring-gray-500 hover:ring-2 text-gray-500 font-semibold text-sm  bg-[#FFF]"
                >
                  {skill}
                  <div onClick={() => removeSkill(skill)}>
                    <X size={16} />
                  </div>
                </div>
              ))}
          </div>
          {/* skill-input */}
          <form onSubmit={addNewSkill} className="flex flex-col gap-3">
            <input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
              placeholder="Add New Skill"
            />
            <button className=" flex gap-2 justify-center items-center rounded-full  transition duration-200 cursor-pointer  p-[7px] px-5 ml-auto border hover:bg-[#0A66C2] hover:text-[#FFF] font-semibold text-md  w-full  text-[#0A66C2] bg-[#FFF]">
              Add Skill
            </button>
          </form>
          {/* add-education */}
          <h2 className="font-medium text-xl text-gray-800 mt-3">
            Add Education
          </h2>
          {/* display-education */}
          <div className="flex flex-col gap-3">
            {editProfileState.education.map((education, index) => {
              const { collage, degree, fieldOfStudy } = education;
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg p-3 bg-gray-100 text-gray-700 relative"
                >
                  <p>
                    <b>College :</b> {collage}
                  </p>
                  <p>
                    <b>Degree :</b> {degree}
                  </p>
                  <p>
                    <b>Field :</b> {fieldOfStudy}
                  </p>
                  <div
                    onClick={() => removeEducation(education)}
                    className="absolute right-[2%] top-[7%] transition duration-200  cursor-pointer  hover:bg-[#FFF] text-black  rounded-full p-[3px]"
                  >
                    <X size={22} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* education-inputs */}
          <form onSubmit={addNewEducation} className="flex flex-col gap-3">
            <input
              value={newEducation.collage}
              onChange={onChangeEducationHandler}
              name="collage"
              className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
              placeholder="College"
            />
            <input
              value={newEducation.degree}
              onChange={onChangeEducationHandler}
              name="degree"
              className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
              placeholder="Degree"
            />
            <input
              value={newEducation.fieldOfStudy}
              onChange={onChangeEducationHandler}
              name="fieldOfStudy"
              className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
              placeholder="Field of study"
            />

            <button className=" flex gap-2 justify-center items-center rounded-full  transition duration-200 cursor-pointer  p-[7px] px-5 ml-auto border hover:bg-[#0A66C2] hover:text-[#FFF] font-semibold text-md  w-full  text-[#0A66C2] bg-[#FFF]">
              Add Education
            </button>
          </form>
          {/* add-experience */}
          <h2 className="font-medium text-xl text-gray-800 mt-3">
            Add Experience
          </h2>

          {/* display-experience */}
          <div className="flex flex-col gap-3">
            {editProfileState.experience.map((experience, index) => {
              const { title, company, description } = experience;
              return (
                <div
                  key={index}
                  className="flex flex-col gap-2 rounded-lg p-3 bg-gray-100 text-gray-700 relative"
                >
                  <p>
                    <b>Title :</b> {title}
                  </p>
                  <p>
                    <b>Company :</b> {company}
                  </p>
                  <p>
                    <b>Description :</b> {description}
                  </p>
                  <div
                    onClick={() => removeExperience(experience)}
                    className="absolute right-[2%] top-[7%] transition duration-200  cursor-pointer  hover:bg-[#FFF] text-black  rounded-full p-[3px]"
                  >
                    <X size={22} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* experience-inputs */}
          <form onSubmit={addNewExperience} className="flex flex-col gap-3">
            <input
              value={newExperience.title}
              onChange={onChangeExperienceHandler}
              name="title"
              className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
              placeholder="Title"
            />
            <input
              value={newExperience.company}
              onChange={onChangeExperienceHandler}
              name="company"
              className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
              placeholder="Company"
            />
            <input
              value={newExperience.description}
              onChange={onChangeExperienceHandler}
              name="description"
              className="w-full border border-gray-200 rounded-md p-2 outline-none focus:shadow-[0_0px_4px_rgb(10,102,194))] focus:focus:ring-1 focus:ring-[rgb(10,102,194)] duration-200   "
              placeholder="Description"
            />

            <button className=" flex gap-2 justify-center items-center rounded-full  transition duration-200 cursor-pointer  p-[7px] px-5 ml-auto border hover:bg-[#0A66C2] hover:text-[#FFF] font-semibold text-md  w-full  text-[#0A66C2] bg-[#FFF]">
              Add Experience
            </button>
          </form>

          {/* save-btn */}
          <button
            disabled={isLoading}
            onClick={onEditSubmitHandler}
            className="mt-3 flex gap-2 justify-center items-center rounded-full transition duration-200 cursor-pointer  p-1 px-5 ml-auto border hover:bg-[#0c71d6] text-[#FFF] font-semibold text-md  bg-[#0A66C2]"
          >
            {isLoading ? "loading..." : "save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
