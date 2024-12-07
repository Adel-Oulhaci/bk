import bac1 from "../assets/bac-1.png";
import bac2 from "../assets/bac-2.png";
import bac3 from "../assets/bac-4.png";
import bac5 from "../assets/bac-5.png";
import join from "../assets/join.png";
import slogin from "../assets/slogin.png";
import who from "../assets/who.png";
import where from "../assets/where.png";




export const formFields = [
  {
    id: "firstName",
    name: "firstn",
    label: "First name",
    placeholder: "Enter your first name",
    arabicLabel: "الاسم",
    type: "text",
    required: true,
  },
  {
    id: "lastName",
    name: "lastn",
    label: "Last name",
    placeholder: "Enter your last name",
    arabicLabel: "اللقب",
    type: "text",
    required: true,
  },
  {
    id: "email",
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    arabicLabel: "البريد الإلكتروني",
    type: "email",
    required: true,
  },
  {
    id: "mobile",
    name: "phone",
    label: "Mobile Number",
    placeholder: "Enter mobile number",
    arabicLabel: "رقم الهاتف",
    type: "number",
    required: true,
  },
  {
    id: "academicLevel",
    name: "academiclevel",
    label: "Academic Level",
    placeholder: "Enter your academic level",
    arabicLabel: "المستوى الدراسي",
    type: "text",
    required: true,
  },
  {
    id: "speciality",
    name: "speciality",
    label: "Speciality",
    placeholder: "Enter your speciality",
    arabicLabel: "التخصص",
    type: "text",
    required: true,
  },
  {
    id: "faculty",
    name: "faculty",
    label: "The Faculty you study at",
    placeholder: "Enter faculty",
    arabicLabel: "الكلية التي تدرس بها",
    type: "text",
    required: true,
  },

];
export const sliderContent = [bac1, bac2, bac3, bac5];
export const ABOUT = [  
  {
  id: "1",
  title: "What is",
  titleGreen: "BADRAT KHAYR Club?",
  description: "BADRAT KHAYR Club is a scientific and cultural club of a charitable nature that was established on October 17, 2019, includes memberss from different disciplines Since its inception, the club has been active in various fields where he carried out various voluntary activities for the benefit of various segments of society.",
  img: who
},
{
  id: "2",
  title: "CLUB",
  titleGreen: "Slogan",
  description: "A journey of a thousand miles begins with one step",
  img: slogin
},  {
  id: "3",
  title: "Where is",
  titleGreen: "the club?",
  description: "BADRAT KHAYR Club is located at the level of the Faculty of Exact Sciences, as it is located inside the faculty at the University of Djillali Liabes Sidi Bel Abbes.",
  img: where
},  {
  id: "4",
  title: "How do I join",
  titleGreen: "the club?",
  description: "With the beginning of each new year for the club, registrations for joining the club are opened, where new memberss are selected by evaluating them and knowing their level and skills required.",
  img: join
}
];
