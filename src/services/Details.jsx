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
export const members = [
  {
    name: " ABDELMOULA Ahlem",
    role: "Public Speaking & Data Analysis",
    image: "",
  },
  {
    name: "ACHOUR AOUL Fatima Zahra",
    role: "Public Speaking & Creative Writer",
    image: "",
  },
  {
    name: "ALI ABBOU Asmaa",
    role: "Event Organizer & Data Analysis",
    image: "",
  },
  {
    name: " AZOUZ Abir Ourida",
    role: "Public Speaking & Data Analysis",
    image: "",
  },
  {
    name: " BELOUFA Fatima Zohra",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " BEN ABDELMOULA Fatima Zahra",
    role: "Research and Analysis,Event Organizer",
    image: "",
  },
  {
    name: " BERNAOUI Khadidja",
    role: "External Realtions",
    image: "",
  },
  {
    name: " BOUHAFS Douaa",
    role: "Event Management",
    image: "",
  },
  {
    name: " BOUNOUA Khaoula",
    role: "Event Organizer & Data Analysis",
    image: "",
  },
  {
    name: " BOUSSIR Bouchra Imene",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " BOUSSIR Nour El Houda Safaa",
    role: "Creative Writer & Data Analysis",
    image: "",
  },
  {
    name: " CHAHER Douaa Anfel",
    role: "Social Media Manager",
    image: "",
  },
  {
    name: " DAOUD Mohamed Abdessamed",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " DEHINI Hadil",
    role: "Videographer",
    image: "",
  },
  {
    name: " DERRAR Chaima El Batoul",
    role: "External Realtions",
    image: "",
  },
  {
    name: " DERRAR Yasser",
    role: "Social Media Manager & Graphic Designer",
    image: "",
  },
  {
    name: " DJELLOULI Sabrina",
    role: "Research and Analysis",
    image: "",
  },
  {
    name: " ELKEBIR Abdelaziz Yacine",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " GHAROUSSI Asmaa",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " GRELE Yasmine",
    role: "Graphic Designer",
    image: "",
  },
  {
    name: " HAKEM Nesrine Zohra",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " KERNAG Manel Sara",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " KRARIL Mousaab",
    role: "Devlopper",
    image: "",
  },
  {
    name: " LACHABI Raid Islam",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " LASSAKEUR Inès lina",
    role: "Photographer",
    image: "",
  },
  {
    name: " MAAFA Nadjoua",
    role: "Research and Analysis & Creative Writer",
    image: "",
  },
  {
    name: " MAHIEDDINE Hadjer",
    role: "Social Media Manager,Creative Writer",
    image: "",
  },
  {
    name: " MANSOUR Sarah",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " MARROUK raghad lamis",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " MEDDAAH Amina",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " MENOUER Ihcene Fatima Zohra",
    role: "Creative Writer",
    image: "",
  },
  {
    name: " MOUFFOK Yacine",
    role: "Videographer",
    image: "",
  },
  {
    name: " OKBI Chaima Nacera",
    role: "Research and Analysis",
    image: "",
  },
  {
    name: " OUAMARA Kawther",
    role: "Strategic Planner",
    image: "",
  },
  {
    name: " OULHACI Adel Fakhr El Islem",
    role: "Developper",
    image: "",
  },
  {
    name: " SAHLI Rayene",
    role: "Graphic Designer,External Realtions",
    image: "",
  },
  {
    name: "SEFOUANE Zakaria Akram",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " SI MOHAMMED Manel",
    role: "Event Management",
    image: "",
  },
  {
    name: " TALHA Fadoua Hibat Allah",
    role: "Videographer & Photographer",
    image: "",
  },
  {
    name: " TALHA Yasser",
    role: "Event Organizer",
    image: "",
  },
  {
    name: " YACINE Sabrine",
    role: "External Realtions",
    image: "",
  },
  {
    name: " ZAIDI Khadidja",
    role: "Media Planner",
    image: "",
  },
];

