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
  description: "BADRAT KHAYR Club is a scientific and cultural club of a charitable nature that was established on October 17, 2019, includes members from different disciplines Since its inception, the club has been active in various fields where he carried out various voluntary activities for the benefit of various segments of society.",
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
  description: "With the beginning of each new year for the club, registrations for joining the club are opened, where new members are selected by evaluating them and knowing their level and skills required.",
  img: join
}
];
 export const responsables = [
  {
    name: "ANES GHALEM",
    role: "Media Manager",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop",
    date: "Depuis Nov 2023",
  },
  {
    name: "ABDELLATIF FERILA ZAZOU",
    role: "President",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
    date: "Depuis Nov 2023",
  },
  {
    name: "ANES GHALEM",
    role: "Media Manager",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
    date: "Depuis Nov 2023",
  },
  {
    name: "ANES GHALEM",
    role: "Media Manager",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200&h=200&fit=crop",
    date: "Depuis Nov 2023",
  },
  {
    name: "KAWTHER CHAMARA",
    role: "Program & Events",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&fit=crop",
    date: "Depuis Nov 2023",
  },
  {
    name: "DJILLALI SAIM",
    role: "Tech & Development",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=200&h=200&fit=crop",
    date: "Depuis Nov 2023",
  },
  {
    name: "ANES GHALEM",
    role: "Media Manager",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
    date: "Depuis Nov 2023",
  },
];

export const members = [
  {
    name: "ANES GHALEM",
    role: "Finalizer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
  },
  {
    name: "ANES GHALEM",
    role: "Finalizer",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&fit=crop",
  },
  {
    name: "ANES GHALEM",
    role: "Finalizer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&fit=crop",
  },
  {
    name: "ANES GHALEM",
    role: "Finalizer",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200&h=200&fit=crop",
  },
  {
    name: "ANES GHALEM",
    role: "Finalizer",
    image:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=200&h=200&fit=crop",
  },
  {
    name: "ANES GHALEM",
    role: "Finalizer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&fit=crop",
  },
];

