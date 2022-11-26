import Icon from "assets/icons/icons";
import { Toaster } from "react-hot-toast";
import { notificationToaster } from "utils/notificationToaster";
import { tw } from "utils/TailwindComponent";
import contactStore from "../lang/contactStore";
import { ContactController } from "./ContactController";

// const sendEmail = (e) => {
//   e.preventDefault();
//   const { name, email, subject, message } = e.target.elements;
//   axiosInstance
//     .post("/user/contact_me", {
//       name: name.value,
//       email: email.value,
//       subject: subject.value,
//       message: message.value,
//     })
//     .then((res) => {
//       notificationToaster(res.data.message);
//       e.target.reset();
//     })
//     .catch((error) => {
//       notificationToaster(error.response?.data?.message || error, true);
//
//     });
// };

const ContactForm = () => {
  const lang = localStorage.getItem("lang-preference") || "english";
  const langComp = contactStore[lang];

  const contactController = new ContactController();

  const FormInput = tw.input`
    bg-white/10
    border
    shadow-sm
    px-4
    py-2
    placeholder-gray-300
    border-gray-500
    focus:border-gray-800 
    focus:ring-2
    focus:bg-black/10
    focus:ring-gray-500
    outline-none
    rounded-sm
    transition
    duration-150
    text-white
    w-full
`;

  const TextArea = tw.textarea`
    bg-white/10
    border
    shadow-sm
    px-4
    py-2
    placeholder-gray-300
    border-gray-500
    focus:border-gray-800 
    focus:ring-2
    focus:bg-black/10
    focus:ring-gray-500
    outline-none
    rounded-sm
    transition
    duration-150
    text-white
    h-full
    w-full
    resize-none
    `;

  return (
    <div className='bg-white/10 rounded-md md:w-2/3 mx-auto overflow-hidden flex flex-col items-center r p-10 border border-white/30 backdrop-blur-sm gap-14 w-11/12  h-full'>
      <h1 className='text-3xl md:text-5xl text-white'>{langComp.title}</h1>
      <form
        className='inputs flex flex-col w-full m-auto justify-center items-end md:gap-14'
        onSubmit={async (e) => {
          contactController
            .sendEmail(e)
            .then((result) => {
              notificationToaster(result.message);
            })
            .catch((error) => {
              notificationToaster(
                error?.response?.data?.message || error,
                true,
              );
            });
        }}>
        <div className='flex flex-col md:flex-row w-full h-full gap-10 my-10 justify-center'>
          <div className='left_inputs flex flex-col gap-14 w-full md:w-1/3'>
            <FormInput
              placeholder={langComp.name}
              type='text'
              name='name'
              required
            />
            <FormInput
              placeholder={langComp.email}
              type='email'
              name='email'
              required
            />
            <FormInput
              placeholder={langComp.subject}
              type='text'
              name='subject'
              required
            />
          </div>
          <div className='right_inputs w-full md:w-1/2 h-[200px] md:h-auto'>
            <TextArea placeholder={langComp.message} name='message' />
          </div>
        </div>
        <div className='flex w-full justify-center px-2 flex-row-reverse'>
          <button className='bg-white/10 border border-gray-500 px-3 py-1 rounded-sm text-white hover:bg-white/5 transition duration-150 flex items-center justify-center'>
            <span>{langComp.send}</span>
            <Icon i='sendArrow' height={15} />
          </button>
          <div className='w-4/5 hidden md:block'></div>
        </div>
      </form>
      <Toaster position='bottom-center' reverseOrder={false} />
    </div>
  );
};

export default ContactForm;
