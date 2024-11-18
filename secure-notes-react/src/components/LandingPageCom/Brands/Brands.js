import React from "react";
import { IoIosPartlySunny } from "react-icons/io";
import { AiOutlineGlobal } from "react-icons/ai";
import { MdOutlineSecurity } from "react-icons/md";
import { SiPythonanywhere } from "react-icons/si";
import { TbPackageExport } from "react-icons/tb";
import { FcAssistant } from "react-icons/fc";
import BrandItem from "./BrandItem";

const Brands = () => {
  return (
    <div className="grid lg:grid-cols-3  sm:grid-cols-2 grid-cols-1 gap-x-4 gap-y-10 pt-20 md:px-0 px-5">
      <BrandItem
        title="World Class Partners"
        text="We’ve partnered with industry leaders and seamlessly integrate with trusted platforms. Synchronize your data workflows with complete security, keeping your work unified and effortless. Let Exception-Handlers bring all your essential platforms together under an impenetrable layer of encryption, so you can focus on what matters."
        icon={IoIosPartlySunny}
      />{" "}
      <BrandItem
        title="Fast Global Supports"
        text="In an unpredictable world, Exception-Handlers offers the stability your data deserves. Backed by a CMOS battery for uninterrupted security, our app notifies you if maintenance is needed, ensuring consistent and reliable data protection. Rest easy knowing our support system is there to secure your information, whenever and wherever you need it."
        icon={AiOutlineGlobal}
      />{" "}
      <BrandItem
        title="Trusting Security"
        text="True security means peace of mind. With Exception-Handlers, every byte of data is protected by our powerful encryption, keeping it private, intact, and accessible only to you. Trust our advanced technology to safeguard what matters most, effortlessly and reliably."
        icon={MdOutlineSecurity}
      />{" "}
      <BrandItem
        title="Anywhere reculting"
        text="Your data, your terms, anywhere you need it. Exception-Handlers offers global accessibility with complete encryption, allowing you to securely access your information no matter where you are. Data protection and convenience, without compromise."
        icon={SiPythonanywhere}
      />{" "}
      <BrandItem
        title="Export Advice"
        text="Your data security journey starts with the right advice. Our team of security experts is here to guide you at every step, ensuring your experience is optimized for maximum protection and ease. We’re dedicated to providing personalized, expert support tailored to your needs."
        icon={TbPackageExport}
      />{" "}
      <BrandItem
        title="Assisted Onboarding"
        text="Get set up seamlessly with Exception-Handlers. Our dedicated onboarding specialists make the transition to secure data storage simple and stress-free, ensuring every detail is in place from day one."
        icon={FcAssistant}
      />
    </div>
  );
};

export default Brands;
