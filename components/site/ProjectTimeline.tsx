"use client";

import { Building2, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProjectTimeline() {
    const t = useTranslations('ProjectsPage');
    const locale = useLocale();
    const isZh = locale === 'zh';
    const [activeYear, setActiveYear] = useState("2024");

    const formatDate = (dateStr: string) => {
        if (!isZh) return dateStr;
        const months: Record<string, string> = {
            'Jan': '1月', 'Feb': '2月', 'Mar': '3月', 'Apr': '4月', 'May': '5月', 'Jun': '6月',
            'Jul': '7月', 'Aug': '8月', 'Sep': '9月', 'Oct': '10月', 'Nov': '11月', 'Dec': '12月',
            'April': '4月', 'July': '7月', 'August': '8月', 'September': '9月'
        };
        let localized = dateStr;
        Object.entries(months).forEach(([en, zh]) => {
            localized = localized.replace(en, zh);
        });
        return localized;
    };

    const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014"];

    const projectData = {
        "2024": [
            { name: "Connexion", client: "Guan Lee Hoe Engrg Pte Ltd", date: "Jan'24" },
            { name: "Ardentec", client: "Cleantech Engrg (S) Pte Ltd", date: "Jan'24" },
            { name: "Bishan 8", client: "Grace Pool Management & Engrg Pte Ltd", date: "Jan'24" },
            { name: "KI Residence", client: "Aquatech Products & Services Pte Ltd", date: "Jan'24" },
            { name: "SAS (Ph 2)", client: "Aquatech Products & Services Pte Ltd", date: "Jan'24" },
            { name: "Water Garden", client: "Hitachi Aqua-Tech Engrg Pte Ltd", date: "Feb'24" },
            { name: "Irwell Hill", client: "Hitachi Aqua-Tech Engrg Pte Ltd", date: "Feb'24" },
            { name: "PDG", client: "Command-Air Pte Ltd", date: "Mar'24" },
            { name: "Pear Bank", client: "Hydrotechs Mechanical & Electrically Service Pte Ltd", date: "Mar'24" },
            { name: "Mt Avernia Hospital", client: "T.G. Engineering Pte Ltd", date: "Mar'24" },
            { name: "West Mall", client: "Gennal Industries Pte Ltd", date: "Apr'24" },
            { name: "16 Tan Quee Lan Street", client: "Hitachi Aqua-Tech Engrg Pte Ltd", date: "Apr'24" },
            { name: "One Shenton", client: "Hitachi Aqua-Tech Engrg Pte Ltd", date: "May'24" },
            { name: "S25 Project", client: "Mech Flo Technologies Pte Ltd", date: "May'24" },
            { name: "Shell Bukom", client: "Carrier Singapore Pte Ltd", date: "Jun'24" },
            { name: "18 Jalan Besut", client: "Trident Switchgear Pte Ltd", date: "Jun'24" }
        ],
        "2023": [
            { name: "Thales", client: "Yorkool Pte Ltd", date: "Jan'23" },
            { name: "Alexandra Hospital", client: "Evotar Engrg Pte Ltd", date: "Jan'23" },
            { name: "Singapore Discovery Center", client: "Enwae Engineering", date: "Jan'23" },
            { name: "Providence Residence", client: "Hitachi Aqua-Tech Engineering Pte Ltd", date: "Feb'23" },
            { name: "AMAT @ Tampines Industrial Crescent", client: "DLM Pte Ltd", date: "Feb'23" },
            { name: "Punggol Regional Sports Center", client: "Sing Wah Enterprise", date: "Feb'23" },
            { name: "Starhub Green", client: "M-Tech Air-con & Security", date: "Mar'23" },
            { name: "Tanglin Mall", client: "Johnson Controls (S) Pte Ltd", date: "Mar'23" },
            { name: "Family Court", client: "Trident Switchgear Pte Ltd", date: "Mar'23" },
            { name: "Clavon", client: "Aquatech Products & Services Pte Ltd", date: "Apr'23" },
            { name: "STEA", client: "Commercial Engineering", date: "Apr'23" },
            { name: "The Reef", client: "Aquatech Products & Services Pte Ltd", date: "May'23" },
            { name: "ST Micro", client: "Lewe Engineering Pte Ltd", date: "Jun'23" },
            { name: "DDCS System at Tampines Central", client: "Alstern Technologies Pte Ltd", date: "Jun'23" },
            { name: "Sea Esta", client: "Grace Pool Management & Engrg", date: "Jun'23" },
            { name: "ICA", client: "Incorporate Engineering Pte Ltd", date: "Jul'23" },
            { name: "Resorts Word at Sentosa Pte Ltd", client: "-", date: "Jul'23" },
            { name: "Hotel Development at Sentosa", client: "3T Ecoplus Pte Ltd", date: "Jul'23" },
            { name: "Forett Condo", client: "Aquatech Products & Services Pte Ltd", date: "Aug'23" },
            { name: "UTAC", client: "Lewe Engineering Pte Ltd", date: "Aug'23" },
            { name: "Ardentec Semiconductor", client: "Design Aire Engrg (S) Pte Ltd", date: "Aug'23" },
            { name: "OBS Project", client: "Hitachi Aqua-Tech Engineering Pte Ltd", date: "Sep'23" },
            { name: "Hewlett Packard", client: "Kaizen Pte Ltd", date: "Sep'23" },
            { name: "APAC Distribution Center", client: "Fidecs Engrg Pte Ltd", date: "Oct'23" },
            { name: "SIMS Urban Oasia", client: "Aquarius Products & Contract Mgmt", date: "Oct'23" },
            { name: "S'pore Epson Industrial Plating Plant", client: "Rich Aire Pte Ltd", date: "Oct'23" },
            { name: "National Research Facility", client: "Kilowatts Engrg", date: "Nov'23" },
            { name: "T9 DCL4 Ph 2 Bldg", client: "Mix-Cool Mechanical Engrg", date: "Dec'23" },
            { name: "Tampines Mall", client: "Alstern Technologies S'pore Pte Ltd", date: "Dec'23" }
        ],
        "2022": [
            { name: "Etanomics (IFE) Phase 1", client: "Total Facility Engrg", date: "Jan'22" },
            { name: "S'pore American School", client: "Aquapool", date: "Feb'22" },
            { name: "Florence Residences", client: "Aquatech Products & Services", date: "Feb'22" },
            { name: "ASE project", client: "Total Facility Engrg Pte Ltd", date: "Mar'22" },
            { name: "Mandai Camp", client: "Ngee Chin Engrg Pte Ltd", date: "Apr'22" },
            { name: "Woodleigh Residence", client: "Hitachi Aqua-Tech Engrg", date: "Apr'22" },
            { name: "T316", client: "Super Tower Industries Pte Ltd", date: "Apr'22" },
            { name: "4 Woodlands Height", client: "Acromec Engineers", date: "May'22" },
            { name: "Canadian Int'l School", client: "Hitachi Aqua-Tech", date: "May'22" },
            { name: "PDG Data Center", client: "Command Aire Pte Ltd", date: "May'22" },
            { name: "LTA @ Sin Ming", client: "Yorkool Pte Ltd", date: "Jun'22" },
            { name: "Turbine Overhaul Services", client: "Carrier (Singapore)", date: "Jul'22" },
            { name: "SICC", client: "Hitachi Aqua-Tech Engineering Pte Ltd", date: "Jul'22" },
            { name: "SSMC", client: "Alstern Technologies Singapore Pte Ltd", date: "Jul'22" },
            { name: "Keppel (Serangoon)", client: "Incorporate Engrg", date: "Aug'22" },
            { name: "Hendon Camp", client: "Ngee Chin Engrg Pte Ltd", date: "Sep'22" },
            { name: "Abbott", client: "Yorkool Pte Ltd", date: "Sep'22" },
            { name: "Ave South Residence", client: "Aquatech Products & Services Pte Ltd", date: "Sep'22" },
            { name: "Sengkang Grand", client: "Hitachi Aqua-Tech Engrg Pte Ltd", date: "Sep'22" },
            { name: "LEICA", client: "DLM Pte Ltd", date: "Sep'22" },
            { name: "Silicon Box Pte Ltd", client: "-", date: "Oct'22" },
            { name: "111 Somerset", client: "Kaer Pte Ltd", date: "Oct'22" },
            { name: "Palawan", client: "Hitachi Aqua-Tech Engrg Pte Ltd", date: "Oct'22" },
            { name: "National Research Facility", client: "Kilowatts Engrg", date: "Oct'22" },
            { name: "Credit Suisse", client: "Peng Yap M&E Systems Pte Ltd", date: "Oct'22" },
            { name: "Creative A/C & Engrg Services Pte Ltd", client: "-", date: "Nov'22" },
            { name: "Tampines 9", client: "Mix Cool Mechanical Engineering", date: "Nov'22" },
            { name: "Capital Tower", client: "Mainland Engrg Pte Ltd", date: "Nov'22" },
            { name: "NTFH", client: "Engie Services Singapore Pte Ltd", date: "Dec'22" },
            { name: "Punggol Sport & Recreation", client: "Aquatech Products", date: "Dec'22" }
        ],
        "2021": [
            { name: "ICA Building", client: "Visionics Engineering", date: "Jan'21" },
            { name: "Merrill Lynch", client: "Waterland Services", date: "Jan'21" },
            { name: "Yishun Fire Station", client: "Mainland", date: "Jan'21" },
            { name: "Fourth Avenue (Aung)", client: "Aquatech Products", date: "Jan'21" },
            { name: "Mandai Camp", client: "ST Engrg Synthesis Pte Ltd", date: "Jan'21" },
            { name: "Changi Airport T1 & T2", client: "Dai Dan", date: "Feb'21" },
            { name: "DC @ AMK", client: "Wah Loon Engrg", date: "Feb'21" },
            { name: "Ubi Road 4", client: "Cosy Ace", date: "Feb'21" },
            { name: "The Stirling", client: "Aquatech Products", date: "Feb'21" },
            { name: "Safra Jurong", client: "Flow Technologies", date: "Feb'21" },
            { name: "Vivo City", client: "Hitachi Aqua-Tech", date: "Mar'21" },
            { name: "Temasek Polytechnic", client: "Johnson Controls", date: "Mar'21" },
            { name: "BD Orchard", client: "Fluematic", date: "Mar'21" },
            { name: "Mandai Camp", client: "ST Engrg Synthesis Pte Ltd", date: "Mar'21" },
            { name: "UWC Project", client: "Innovez Engineering", date: "Apr'21" },
            { name: "Parc Esta", client: "Aquatech Products", date: "Apr'21" },
            { name: "Grocery Store", client: "Pumpcraft Singapore Pte Ltd", date: "Apr'21" },
            { name: "Dnata Singapore HQ", client: "Kaer Pte Ltd", date: "May'21" },
            { name: "Dnata Cargo Project", client: "Kaer Pte Ltd", date: "May'21" },
            { name: "Resorts World At Sentosa Pte Ltd", client: "-", date: "May'21" },
            { name: "Takashimaya level 7", client: "Dai Dan Co Ltd", date: "Jun'21" },
            { name: "NTUC @ Sunview Road", client: "Pumpcraft Singapore", date: "Jun'21" },
            { name: "SDC Singapore", client: "Enwae Engrg Pte Ltd", date: "Jul'21" },
            { name: "RenCi Hospital", client: "Kiden Engineering Pte Ltd", date: "Jul'21" },
            { name: "NSCC Data Centre @ NUS", client: "Alfa Tech VestAsia", date: "Jul'21" },
            { name: "ACME Project", client: "-", date: "Jul'21" },
            { name: "KDCSGP1", client: "Kaizen Pte Ltd", date: "Jul'21" },
            { name: "Skyworks", client: "Lewe Engineering Pte Ltd", date: "Jul'21" },
            { name: "Family Justice Court", client: "Peng Yap M&E Systems", date: "Aug'21" },
            { name: "Harbour Drive", client: "Little Swan Air-Conditioning Engrg", date: "Aug'21" },
            { name: "Sumang Walk", client: "Hitachi Aquatech Engineering Pte Ltd", date: "Sep'21" },
            { name: "VRM Services 2018", client: "-", date: "Sep'21" },
            { name: "The MCST 2504 - Thomson 800", client: "-", date: "Sep'21" },
            { name: "SAS", client: "Aquatech Products & Services Pte Ltd", date: "Oct'21" },
            { name: "Orchard Shopping Center", client: "Carrier Singapore", date: "Oct'21" },
            { name: "Great World City", client: "Strength Pte Ltd", date: "Oct'21" },
            { name: "NTUC Central Kitchen", client: "Strut Airconditioning", date: "Oct'21" },
            { name: "T316", client: "Super Tower Industries Pte Ltd", date: "Nov'21" },
            { name: "Sengkang Swimming Complex", client: "Modern Pool", date: "Nov'21" },
            { name: "Linxens", client: "GDD Asia Pte Ltd", date: "Nov'21" },
            { name: "Mandai Camp", client: "Ngee Chin Engrg Pte Ltd", date: "Nov'21" },
            { name: "Pan Pacific", client: "Aquatech Products & Services Pte Ltd", date: "Dec'21" }
        ],
        "2020": [
            { name: "YHS", client: "SPC Holding", date: "Jan'20" },
            { name: "NUOVA", client: "Modern Pool", date: "Jan'20" },
            { name: "Delta Sport Center", client: "Hitachi Aqua-Tech", date: "Jan'20" },
            { name: "ST Hubert", client: "Takasago", date: "Jan'20" },
            { name: "150 Neo Tiew Road", client: "Acromec Engineers", date: "Feb'20" },
            { name: "YHS", client: "Ventco Engrg", date: "Mar'20" },
            { name: "PWC", client: "PumpCraft Singapore", date: "Apr'20" },
            { name: "BD Orchard", client: "GWTech", date: "Jun'20" },
            { name: "Jurong East Singtel Exchange", client: "GWTech", date: "Jul'20" },
            { name: "West Coast Vale", client: "Hitachi Aqua-Tech", date: "Jul'20" },
            { name: "Queenstown & Hougang Singtel Exchange", client: "Kilowatts", date: "Sep'20" },
            { name: "Luzerne Bldg", client: "M-tech", date: "Oct'20" },
            { name: "The Fullerton Hotel", client: "Kaer Pte Ltd", date: "Nov'20" },
            { name: "Keppel Datahub T25", client: "Wah Loon Engrg", date: "Nov'20" },
            { name: "Great World City", client: "Aquapool", date: "Nov'20" },
            { name: "BCA Academy", client: "Trans Equatorial", date: "Nov'20" },
            { name: "Organic Farm", client: "Aim Aircon", date: "Dec'20" }
        ],
        "2019": [
            { name: "Murata Line T24", client: "Takasago Singapore", date: "Jan'19" },
            { name: "Jurong East", client: "Kilowatts Engineering", date: "Jan'19" },
            { name: "25 Pandan Crescent", client: "Cosy-Ace", date: "Jan'19" },
            { name: "Tetra Pak", client: "Air Vision", date: "Jan'19" },
            { name: "Haliburton Tuas", client: "SKF Asia", date: "Jan'19" },
            { name: "Nexus International School", client: "Aquatech", date: "Feb'19" },
            { name: "Kranji Loop", client: "Guthrie", date: "Feb'19" },
            { name: "Fullerton Hotel", client: "Goldwind Srvs", date: "Feb'19" },
            { name: "Hometeam", client: "Winner", date: "Mar'19" },
            { name: "Woodland Polyclinic", client: "Yitac", date: "Mar'19" },
            { name: "Kallang Warehouse", client: "Commercial", date: "Mar'19" },
            { name: "Resorts World Singapore", client: "-", date: "Apr'19" },
            { name: "Parkway Health", client: "Acromec", date: "Apr'19" },
            { name: "NUS", client: "Sodexo Kim Yew", date: "Apr'19" },
            { name: "AFRO Asia", client: "-", date: "May'19" },
            { name: "CTSQ", client: "-", date: "May'19" },
            { name: "Keat Hong", client: "Kin Xin Engrg", date: "Jun'19" },
            { name: "Keppel Datahub", client: "Wah Loon", date: "Jun'19" },
            { name: "3M", client: "Total Facilities", date: "Jul'19" },
            { name: "M Hotel", client: "Winstream Engrg", date: "Jul'19" },
            { name: "Cummins Test Cell", client: "Kion Engrg", date: "Aug'19" },
            { name: "Tapestry", client: "Hitachi AquaTech", date: "Aug'19" },
            { name: "NEX", client: "Goh General", date: "Sep'19" },
            { name: "20 Ayer Rajah Crescent", client: "Square Fresco", date: "Sep'19" },
            { name: "Pepper & Fuchs", client: "ATDIO Pte Ltd", date: "Sep'19" },
            { name: "KD @ Tampines", client: "IX Technology", date: "Dec'19" },
            { name: "SG @ Bedok (CR5)", client: "Takasago", date: "Dec'19" },
            { name: "NTU ABS", client: "Presico", date: "Dec'19" },
            { name: "SG MISC", client: "Takasago", date: "Dec'19" },
            { name: "Rivercove Residences", client: "Aquatech Products", date: "Dec'19" },
            { name: "Haw Par Center", client: "GWTech Engrg", date: "Dec'19" }
        ],
        "2018": [
            { name: "The Clement Canopy", client: "Aquatech", date: "Jan'18" },
            { name: "College of Medicine Building", client: "Johnson Controls", date: "Jan'18" },
            { name: "Seagate AMK", client: "GoodTech", date: "Feb'18" },
            { name: "Tuas View Square", client: "NKH Building", date: "Feb'18" },
            { name: "EOM Engineering", client: "-", date: "Feb'18" },
            { name: "Skyworks", client: "Carrier Singapore", date: "Feb'18" },
            { name: "Ice Skating", client: "Constructive Engineers Ltd", date: "Feb'18" },
            { name: "Science Park 1", client: "Design Aire", date: "Mar'18" },
            { name: "Tanaka Electronics Singapore", client: "Peng Yap M&E", date: "Mar'18" },
            { name: "Custom Complex", client: "Poh Meng Engineering", date: "April'18" },
            { name: "Wood Square", client: "EOM Engineering", date: "April'18" },
            { name: "Tuas View Square", client: "NKH Building", date: "April'18" },
            { name: "Temasek Lifescience", client: "Luova Engineering", date: "May'18" },
            { name: "Lake Grands", client: "Aquatech", date: "May'18" },
            { name: "T3 South Pier", client: "Dai-Dan", date: "July'18" },
            { name: "KD Project", client: "Carrier Singapore", date: "July'18" },
            { name: "Capricon", client: "Evergreen Engineering", date: "July'18" },
            { name: "20 Kian Teck Lane", client: "Aim Air-con", date: "July'18" },
            { name: "Skyworks", client: "Takasago", date: "July'18" },
            { name: "Linxens", client: "Johnson Controls", date: "August'18" },
            { name: "Phillip Morris", client: "MAG 45 Pte Ltd", date: "August'18" },
            { name: "Seraya Terminal", client: "Bintai Kindenko", date: "September'18" },
            { name: "NCS Hub AMK", client: "M-Tech", date: "September'18" },
            { name: "Etha Engineering Pte Ltd", client: "-", date: "September'18" },
            { name: "Putra Water Treatment Pte Ltd", client: "-", date: "September'18" },
            { name: "Balestier Plaza", client: "SPC Holdings", date: "September'18" },
            { name: "Factory In Woodlands", client: "Trane Distribution", date: "September'18" },
            { name: "PLQ", client: "Hydrotechs M&E Services", date: "September'18" },
            { name: "Tentronics Pte Ltd", client: "-", date: "October'18" },
            { name: "Zaelex", client: "Constructive", date: "October'18" },
            { name: "Raffles City", client: "-", date: "Nov'18" },
            { name: "NCS", client: "-", date: "Nov'18" },
            { name: "KD Project", client: "-", date: "Nov'18" },
            { name: "Super Tower", client: "-", date: "Nov'18" },
            { name: "Tuas Naval Base", client: "-", date: "Dec'18" },
            { name: "Pan Pacific Hotel", client: "-", date: "Dec'18" },
            { name: "KD Project", client: "-", date: "Dec'18" },
            { name: "Singapore American School", client: "-", date: "Dec'18" }
        ],
        "2017": [
            { name: "50 Kallang Ave", client: "Intac Systems", date: "Jan'17" },
            { name: "OUB Tower 1", client: "Shinryo Singapore", date: "Jan'17" },
            { name: "Concord Shopping Centre", client: "Johnson Controls", date: "Jan'17" },
            { name: "Sims Oasis", client: "Hydrotechs M&E Services P/L", date: "Feb'17" },
            { name: "Yishun EC", client: "Hydrotechs M&E Services P/L", date: "Feb'17" },
            { name: "38 Sty Cecil Street", client: "Chemline Products", date: "Mar'17" },
            { name: "Mandai Camp", client: "ST Synthesis", date: "Mar'17" },
            { name: "AMK Data Centre", client: "Chin Shin M&E", date: "Mar'17" },
            { name: "Treasure Crescent", client: "Aquatech", date: "Mar'17" },
            { name: "Highline", client: "Aquatech", date: "Mar'17" },
            { name: "ICA Tuas", client: "Trane Distribution", date: "April'17" },
            { name: "ICA Woodlands", client: "Trane Distribution", date: "April'17" },
            { name: "ORO", client: "Incorporate Engineering", date: "April'17" },
            { name: "Environment Building", client: "Winner Engineering", date: "April'17" },
            { name: "KA Centre", client: "Evergreen Engineering", date: "April'17" },
            { name: "NCS", client: "Cosy Ace", date: "May'17" },
            { name: "Lucky Chinatown", client: "Cycle Aire", date: "June'17" },
            { name: "Parc Life", client: "Hydrotechs M&E Services P/L", date: "June'17" },
            { name: "Chai Chee Technopark", client: "WKH Construction", date: "July'17" },
            { name: "Beyonics", client: "Design Aire", date: "July'17" },
            { name: "Deluge Fire", client: "Chemline Products", date: "July'17" },
            { name: "Sol Acres", client: "Modern Pool", date: "July'17" },
            { name: "P SH", client: "PumpCraft Singapore", date: "Aug'17" },
            { name: "Geylang Singtel Exchange", client: "M-Tech Air-Con", date: "Aug'17" },
            { name: "German European School", client: "Aquatech", date: "Sep'17" },
            { name: "Mandai Camp", client: "ST Synthesis", date: "Sep'17" },
            { name: "Changi North Crescent", client: "Guan Lee Hoe", date: "Sep'17" },
            { name: "Aqueen Hotel", client: "Accon Engineering", date: "Sep'17" },
            { name: "Singapore Conference Hall", client: "Mainland Engineering", date: "Sep'17" },
            { name: "111 Somerset", client: "M-Tech Air-Con", date: "Sep'17" },
            { name: "Boeing", client: "GWTECH", date: "Sep'17" },
            { name: "Capri Hotel", client: "Shinryo Singapore", date: "Oct'17" },
            { name: "RWS", client: "Linkforces P/L", date: "Oct'17" },
            { name: "Skyworks", client: "Takasago Singapore", date: "Oct'17" },
            { name: "Sentosa Outpost", client: "Aquatech", date: "Oct'17" },
            { name: "Eagles", client: "Carrier Singapore", date: "Oct'17" },
            { name: "Mandai Camp", client: "ST Synthesis", date: "Nov'17" },
            { name: "China Embassy", client: "Cool Dynamics", date: "Nov'17" },
            { name: "Mandai Camp", client: "ST Synthesis", date: "Dec'17" },
            { name: "The POIZ", client: "-", date: "Dec'17" }
        ],
        "2016": [
            { name: "DSO National Lab", client: "Siew Engineering Services (S) Pte Ltd", date: "Jan'16" },
            { name: "Bedok Integrated Complex", client: "Aquatech Products", date: "Feb'16" },
            { name: "Farrer Park", client: "Evergreen Engineering & Construction Pte Ltd", date: "Mar'16" },
            { name: "RiverBank", client: "Hydrotechs M&E Services P/L", date: "April'16" },
            { name: "Jurong Town Hall Building", client: "Sing Wah Enterprise P/L", date: "April'16" },
            { name: "Watertown", client: "Aquatech Products", date: "May'16" },
            { name: "Bellewaters", client: "Aquatech Products", date: "May'16" },
            { name: "The Glade", client: "Hydrotechs M&E Services P/L", date: "May'16" },
            { name: "Tampines", client: "Lee Tech Engrg P/L", date: "June'16" },
            { name: "Thye Hua Kwan Hospital", client: "DEG Engineering", date: "June'16" },
            { name: "Junction City", client: "Constructive Engineers Ltd", date: "June'16" },
            { name: "Pullman Hotel", client: "Hometech Engrg", date: "June'16" },
            { name: "Junction City", client: "Constructive Engineers", date: "Sep'16" },
            { name: "Glaxo Wellcome Manufacturing", client: "-", date: "Sep'16" },
            { name: "Gallery Hotel", client: "Evergreen Engineering", date: "Oct'16" },
            { name: "Commercial Development", client: "Progen Pte Ltd", date: "Nov'16" },
            { name: "Flora Ville & Flora Vista", client: "Aquatech", date: "Nov'16" },
            { name: "Pioneer Cable Tunnel", client: "GWTECH", date: "Dec'16" }
        ],
        "2015": [
            { name: "NOL Building", client: "Fortuna Air-Conditioning", date: "Jan'15" },
            { name: "QBay", client: "Hydrotechs Mechanical And Electrically Service Pte Ltd", date: "Jan'15" },
            { name: "NUS AS8", client: "Trane Distribution Pte Ltd", date: "Jan'15" },
            { name: "Safra Club Punggol", client: "Winner Engineering Pte Ltd", date: "Feb'15" },
            { name: "Changi Airport Terminal T2", client: "Dai Dan Co Ltd", date: "Mar'15" },
            { name: "Mandarin Hotel", client: "Trane Singapore", date: "Mar'15" },
            { name: "Nordic Building", client: "Evergreen Engineering & Construction Pte Ltd", date: "Mar'15" },
            { name: "Mandai", client: "Evergreen Engineering & Construction Pte Ltd", date: "Mar'15" },
            { name: "Katong Hotel", client: "Great Resources M&E Contractor P/L", date: "Mar'15" },
            { name: "Singpost Logistics Hub", client: "Hitachi Infrastructure Systems (Asia) P/L", date: "April'15" },
            { name: "Asia Pacific Breweries", client: "Westemp Engrg (S) P/L", date: "April'15" },
            { name: "Tampines Warehouse", client: "FAB-5 Pte Ltd", date: "April'15" },
            { name: "Skies Miltonia", client: "Hydrotechs M&E Service Pte Ltd", date: "May'15" },
            { name: "Royal Square", client: "Visionics Engineering Pte Ltd", date: "May'15" },
            { name: "United World College", client: "Peng Yap M&E Systems Pte Ltd", date: "May'15" },
            { name: "CFS @ Buroh Lane", client: "Kaer Pte Ltd", date: "June'15" },
            { name: "No. 6 Shenton Way", client: "Dai-Dan Co. Ltd", date: "June'15" },
            { name: "Science Park Drive", client: "Tresima Asia Pte Ltd", date: "July'15" },
            { name: "SBF Centre", client: "Leong Hum Engineering P/L", date: "July'15" },
            { name: "Infloral", client: "Aquatech Products & Services P/L", date: "July'15" },
            { name: "Philips Singapore", client: "Kin Xin Engineering P/L", date: "July'15" },
            { name: "The Jewel", client: "Aquatech Products & Services Pte Ltd", date: "July'15" },
            { name: "Techview", client: "Trane Distribution Pte Ltd", date: "Aug'15" },
            { name: "Airbus", client: "Design Aire Engineering (S) P/L", date: "Aug'15" },
            { name: "Ministry of Foreign Affairs", client: "Trane Distribution P/L", date: "Aug'15" },
            { name: "Forestville", client: "Hydrotechs M&E Service Pte Ltd", date: "Sep'15" },
            { name: "Chai Chee Technopark", client: "Aim AirCon Engineering P/L", date: "Sep'15" },
            { name: "Oasis and Rutherford", client: "Trane Distribution Pte Ltd", date: "Sep'15" },
            { name: "Crowne Plaza Hotel", client: "Powen Engineering Pte Ltd", date: "Sep'15" },
            { name: "Law Enforcement Academy", client: "Kurihara Kogyo Co., Ltd", date: "Nov'15" },
            { name: "JTC Medical Hub", client: "Lead Management Engrg & Constn. P/L", date: "Nov'15" },
            { name: "Health and Medical Building", client: "Shinryo Singapore P/L", date: "Nov'15" },
            { name: "Academic Building @ NTU", client: "Winner Engrg P/L", date: "Dec'15" },
            { name: "Law Enforcement Academy", client: "Kurihara Kogyo Co., Ltd", date: "Dec'15" }
        ],
        "2014": [
            { name: "Singapore Poly", client: "GWTECH Engineering P/L", date: "Jan'14" },
            { name: "Prudential Tower", client: "Supersonics Air-Con & Elect. Engrg P/L", date: "Jan'14" },
            { name: "Sun Plaza", client: "Gennal Industries P/L", date: "Jan'14" },
            { name: "NTU @ South Spine", client: "Supersonics Air-Con & Elect. Engrg P/L", date: "Jan'14" },
            { name: "UOB Plaza", client: "Thermal Private Limited", date: "Jan'14" },
            { name: "Keppel Logistics", client: "Supersonics Air-Con & Elect. Engrg P/L", date: "Jan'14" },
            { name: "Sans Centre", client: "King Wan Constn. P/L", date: "Feb'14" },
            { name: "UOB Tower Annex", client: "Trane Distribution P/L", date: "Feb'14" },
            { name: "Treasure Trove", client: "Hydrotechs M&E Services P/L", date: "Mar'14" },
            { name: "Orchard Hotel", client: "Kion Engrg P/L", date: "Mar'14" },
            { name: "Ngee Ann Polytechnic", client: "Luova Engrg P/L", date: "April'14" },
            { name: "Rain Forest", client: "Hydrotechs M&E Services P/L", date: "May'14" },
            { name: "Interpol Global Complex", client: "Trans Equatorial Engrg P/L", date: "May'14" },
            { name: "Fusionpolis 5", client: "Azbil Singapore P/L", date: "May'14" },
            { name: "Orchard Tower", client: "Kaer P/L", date: "June'14" },
            { name: "79 Ayer Rajah Crescent", client: "Siew Engrg Services (S) P/L", date: "June'14" },
            { name: "Waterfront Isle", client: "Hydrotechs M&E Services P/L", date: "July'14" },
            { name: "Temasek Club", client: "Lee Tech Engrg P/L", date: "July'14" },
            { name: "Bukit Panjang Plaza", client: "Visionics Engrg P/L", date: "Aug'14" },
            { name: "Temasek Poly East Wing", client: "Kin Xin Engrg P/L", date: "Aug'14" },
            { name: "Alpha & Cintech", client: "Evergreen Engrg & Constn. P/L", date: "Aug'14" },
            { name: "Twin Waterfall", client: "Hydrotechs M&E Service P/L", date: "Sep'14" },
            { name: "Paragon Mall", client: "Powen Elect. Engrg P/L", date: "Sep'14" },
            { name: "Sedona Hotel", client: "Syntes Pte Ltd", date: "Oct'14" },
            { name: "International Building", client: "Johnson Controls (S) P/L", date: "Nov'14" },
            { name: "Microcircuit", client: "Trane Distribution P/L", date: "Dec'14" },
            { name: "Ripple Bay", client: "Aquatech Products & Services P/L", date: "Dec'14" }
        ],
    };

    return (
        <section className="py-12 md:py-24 max-w-7xl mx-auto px-4 md:px-8 text-left">
            <Tabs value={activeYear} onValueChange={setActiveYear} className="w-full">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                    {/* Year Selector (Side) */}
                    <div className="w-full lg:w-[280px] lg:shrink-0">
                        <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b-2 border-slate-900 pb-2">{t('selectYear')}</h3>

                        {/* Mobile/Tablet Dropdown */}
                        <div className="relative lg:hidden mb-8">
                            <select
                                value={activeYear}
                                onChange={(e) => setActiveYear(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-5 py-4 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronDown className="w-5 h-5" />
                            </div>
                        </div>

                        {/* Desktop List */}
                        <TabsList className="hidden lg:flex flex-wrap bg-transparent !h-auto p-0 gap-2 w-full">
                            {years.map(year => (
                                <TabsTrigger
                                    key={year}
                                    value={year}
                                    className="rounded-sm border border-slate-200 bg-white data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-blue-600 px-4 py-3 font-bold text-sm transition-all shadow-none"
                                >
                                    {year}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* Project List (Main) */}
                    <div className="flex-1 min-w-0">
                        {years.map(year => (
                            <TabsContent key={year} value={year} className="mt-0 focus-visible:outline-none">
                                <motion.div
                                    className="w-full"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="flex items-baseline gap-4 mb-8">
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">{t('installationsTitle', { year })}</h2>
                                        <div className="flex-1 border-t-2 border-slate-100" />
                                    </div>

                                    <motion.div
                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={{
                                            hidden: { opacity: 0 },
                                            show: {
                                                opacity: 1,
                                                transition: {
                                                    staggerChildren: 0.1
                                                }
                                            }
                                        }}
                                    >
                                        {/* @ts-ignore */}
                                        {projectData[year]?.map((project, idx) => (
                                            <motion.div
                                                key={`${project.name}-${idx}`}
                                                className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-500 hover:shadow-md transition-all flex flex-col gap-5"
                                                variants={{
                                                    hidden: { opacity: 0, y: 20 },
                                                    show: { opacity: 1, y: 0 }
                                                }}
                                            >
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="bg-slate-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                                                        <Building2 className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">{project.name}</h4>
                                                        <p className="text-sm text-slate-500 font-semibold mt-1">{project.client !== "-" ? project.client : t('directInstallation')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        {t('completed')} {formatDate(project.date)}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black tracking-widest uppercase">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        {t('verified')}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            </TabsContent>
                        ))}
                    </div>
                </div>
            </Tabs>
        </section>
    );
}
