import { hashPassword } from '../utils/crypto';
import type { Gender, EducationLevel, AreaType, SocialCategory, RuleOperator } from '../types';

export interface SeedRule {
  field_name: string;
  operator: RuleOperator;
  expected_value: string;
  is_mandatory: number;
  rule_description: string;
}

export interface SeedDocument {
  document_name: string;
  is_mandatory: number;
  instructions: string;
}

export interface SeedScholarship {
  id: string;
  name: string;
  provider: string;
  description: string;
  amount_description: string;
  amount_value: number;
  deadline: string;
  official_notice_url: string;
  is_published: number;
  rules: SeedRule[];
  documents: SeedDocument[];
}

export const SEED_SCHOLARSHIPS: SeedScholarship[] = [
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    name: 'Post-Matric Scholarship for SC/ST Students (Assam/North-East)',
    provider: 'Government of Assam & Ministry of Tribal Affairs',
    description:
      'Provides financial assistance to Scheduled Caste and Scheduled Tribe students studying at post-matriculation or post-secondary stages to enable them to complete their education.',
    amount_description: '₹30,000 per annum + Tuition Fee reimbursement',
    amount_value: 30000,
    deadline: '2026-11-30',
    official_notice_url: 'https://scholarships.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'category',
        operator: 'IN',
        expected_value: 'SC, ST',
        is_mandatory: 1,
        rule_description: 'Applicant must belong to Scheduled Caste (SC) or Scheduled Tribe (ST) category.',
      },
      {
        field_name: 'domicile_state',
        operator: 'IN',
        expected_value: 'Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura',
        is_mandatory: 1,
        rule_description: 'Applicant must be a permanent resident of a North-Eastern state.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '250000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹2,50,000.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate, diploma',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in undergraduate, postgraduate, or recognized diploma courses.',
      },
    ],
    documents: [
      {
        document_name: 'Caste Certificate',
        is_mandatory: 1,
        instructions: 'Issued by the competent district authority / Sub-Divisional Officer.',
      },
      {
        document_name: 'Income Certificate',
        is_mandatory: 1,
        instructions: 'Current financial year certificate issued by Circle Officer / Revenue Authority.',
      },
      {
        document_name: 'Permanent Resident Certificate (PRC)',
        is_mandatory: 1,
        instructions: 'Proof of domicile in Assam / North-East state.',
      },
      {
        document_name: 'Previous Year Marksheet',
        is_mandatory: 1,
        instructions: 'Self-attested copy of qualifying examination marksheet.',
      },
      {
        document_name: 'Bank Passbook Copy',
        is_mandatory: 1,
        instructions: 'First page showing student name, account number, and IFSC code.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    name: 'Pragati Scholarship for Girl Students in Technical Education (AICTE)',
    provider: 'All India Council for Technical Education (AICTE)',
    description:
      'A national scheme aimed at empowering young women by providing financial support to pursue technical and engineering education in AICTE approved institutions.',
    amount_description: '₹50,000 per annum for degree / diploma course duration',
    amount_value: 50000,
    deadline: '2026-12-15',
    official_notice_url: 'https://www.aicte-india.org/schemes/students-development-schemes/pragati',
    is_published: 1,
    rules: [
      {
        field_name: 'gender',
        operator: 'EQ',
        expected_value: 'female',
        is_mandatory: 1,
        rule_description: 'Exclusively open for female candidates.',
      },
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Engineering, Technology, Computer Science',
        is_mandatory: 1,
        rule_description: 'Must be pursuing technical degree or engineering.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '800000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹8,00,000.',
      },
      {
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '6.0',
        is_mandatory: 1,
        rule_description: 'Minimum current CGPA of 6.0 out of 10.0.',
      },
    ],
    documents: [
      {
        document_name: 'AICTE Centralized Admission Allotment Letter',
        is_mandatory: 1,
        instructions: 'Proof of admission into 1st year of degree/diploma.',
      },
      {
        document_name: 'Annual Family Income Certificate',
        is_mandatory: 1,
        instructions: 'Issued by Tahsildar / competent executive magistrate.',
      },
      {
        document_name: 'Class 10th and 12th Marksheets',
        is_mandatory: 1,
        instructions: 'Attested copies of secondary and senior secondary marksheets.',
      },
      {
        document_name: 'Aadhaar Card',
        is_mandatory: 1,
        instructions: 'Valid Aadhaar linked with mobile and active bank account.',
      },
      {
        document_name: 'College Bonafide Certificate',
        is_mandatory: 1,
        instructions: 'Signed and stamped by Head of Institution / Principal.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    name: 'Central Sector Scheme of Scholarships for College and University Students',
    provider: 'Department of Higher Education (Ministry of Education)',
    description:
      'Merit-cum-means scholarship for meritorious students from low-income families pursuing regular graduate and post-graduate degree courses.',
    amount_description: '₹20,000 per annum for college & university study',
    amount_value: 20000,
    deadline: '2026-11-15',
    official_notice_url: 'https://scholarships.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '450000',
        is_mandatory: 1,
        rule_description: 'Gross annual parental income must be less than or equal to ₹4,50,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '80.0',
        is_mandatory: 1,
        rule_description: 'Must have scored above 80th percentile (or >= 80%) in Class 12 board examination.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate',
        is_mandatory: 1,
        rule_description: 'Must be pursuing regular higher education degree courses.',
      },
      {
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '6.5',
        is_mandatory: 0,
        rule_description: 'Recommended ongoing CGPA >= 6.5 for renewal.',
      },
    ],
    documents: [
      {
        document_name: 'Class 12th Board Marksheet',
        is_mandatory: 1,
        instructions: 'Showing board percentile or aggregate marks.',
      },
      {
        document_name: 'Income Certificate',
        is_mandatory: 1,
        instructions: 'Certified by Tahsildar or Block Development Officer.',
      },
      {
        document_name: 'College Fee Receipt & Bonafide Certificate',
        is_mandatory: 1,
        instructions: 'Verification of current enrollment in full-time regular course.',
      },
      {
        document_name: 'Aadhaar Card',
        is_mandatory: 1,
        instructions: 'Aadhaar card copy.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    name: 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
    provider: 'Department of School Education & Literacy (Govt of India)',
    description:
      'Aims to arrest the drop-out rate among economically weaker students and encourage them to continue secondary stage education.',
    amount_description: '₹12,000 per annum (₹1,000 per month)',
    amount_value: 12000,
    deadline: '2026-10-31',
    official_notice_url: 'https://scholarships.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'education_level',
        operator: 'EQ',
        expected_value: 'school',
        is_mandatory: 1,
        rule_description: 'Exclusively for students enrolled in secondary school (Class 9 to 12).',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '350000',
        is_mandatory: 1,
        rule_description: 'Annual parental income from all sources must not exceed ₹3,50,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '55.0',
        is_mandatory: 1,
        rule_description: 'Minimum 55% marks or equivalent grade in the qualifying examination.',
      },
    ],
    documents: [
      {
        document_name: 'Parental Income Certificate',
        is_mandatory: 1,
        instructions: 'Government certified income certificate.',
      },
      {
        document_name: 'NMMSS Selection Examination Result Card',
        is_mandatory: 1,
        instructions: 'Proof of qualifying state-level NMMS examination.',
      },
      {
        document_name: 'School Headmaster Attestation Letter',
        is_mandatory: 1,
        instructions: 'Certificate confirming current study in Government / Local Body school.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000005',
    name: 'ONGC Foundation Scholarship for Meritorious SC/ST/OBC Students',
    provider: 'Oil and Natural Gas Corporation (ONGC) Foundation',
    description:
      'Corporate CSR initiative offering monetary assistance to meritorious underprivileged students pursuing Engineering, MBBS, Geology, Geophysics, or MBA.',
    amount_description: '₹48,000 per annum (₹4,000 per month)',
    amount_value: 48000,
    deadline: '2026-10-15',
    official_notice_url: 'https://ongcscholar.org',
    is_published: 1,
    rules: [
      {
        field_name: 'category',
        operator: 'IN',
        expected_value: 'SC, ST, OBC',
        is_mandatory: 1,
        rule_description: 'Applicant must belong to SC, ST, or OBC community.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '200000',
        is_mandatory: 1,
        rule_description: 'Total annual family income must not exceed ₹2,00,000.',
      },
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Engineering, Medical, Science, Management, Commerce',
        is_mandatory: 1,
        rule_description: 'Must be pursuing Engineering, Medicine, Geosciences, or MBA.',
      },
      {
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '6.0',
        is_mandatory: 1,
        rule_description: 'Minimum 6.0 CGPA on a 10-point scale or equivalent 60% marks.',
      },
    ],
    documents: [
      {
        document_name: 'Caste / Community Certificate',
        is_mandatory: 1,
        instructions: 'Central / State format SC/ST/OBC certificate.',
      },
      {
        document_name: 'Income Certificate',
        is_mandatory: 1,
        instructions: 'Certified by Revenue Officer not below the rank of Tehsildar.',
      },
      {
        document_name: 'Previous Examination Marksheet',
        is_mandatory: 1,
        instructions: 'Class 12th or previous degree marksheet showing >= 60%.',
      },
      {
        document_name: 'College Admission Verification Certificate (ECS Form)',
        is_mandatory: 1,
        instructions: 'Duly verified by Dean / Head of Institute.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000006',
    name: 'Sitaram Jindal Foundation Scholarship Scheme',
    provider: 'Sitaram Jindal Foundation',
    description:
      'Merit-cum-means scholarship helping underprivileged students who are keen to continue their higher studies in general, professional, and diploma courses.',
    amount_description: '₹30,000 per annum for undergraduate & postgraduate courses',
    amount_value: 30000,
    deadline: '2026-12-31',
    official_notice_url: 'https://www.sitaramjindalfoundation.org/scholarships.php',
    is_published: 1,
    rules: [
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '400000',
        is_mandatory: 1,
        rule_description: 'Family income must be within ₹4,00,000 per annum (rural: ₹2.5L, urban: ₹4L).',
      },
      {
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '6.5',
        is_mandatory: 1,
        rule_description: 'Minimum CGPA of 6.5 (equivalent to 65% for boys, 60% for girls).',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate, diploma',
        is_mandatory: 1,
        rule_description: 'Applicable for UG, PG, and technical diploma courses.',
      },
    ],
    documents: [
      {
        document_name: 'Last Examination Marksheet',
        is_mandatory: 1,
        instructions: 'Attested marksheet of the most recent academic year/semester.',
      },
      {
        document_name: 'Annual Family Income Certificate',
        is_mandatory: 1,
        instructions: 'Certificate issued by competent revenue authority.',
      },
      {
        document_name: 'Principal / Head of Institution Recommendation Letter',
        is_mandatory: 1,
        instructions: 'Annexure form stamped by college authority.',
      },
      {
        document_name: 'Current Year Fee Receipts',
        is_mandatory: 1,
        instructions: 'Receipts showing tuition and hostel fee payments.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000007',
    name: 'HDFC Educational Crisis Scholarship Support (ECSS)',
    provider: 'HDFC Bank Parivartan',
    description:
      'Assists vulnerable students who are at risk of dropping out due to personal or financial crisis, such as loss of earning family member or catastrophic medical emergency.',
    amount_description: '₹75,000 one-time financial support grant',
    amount_value: 75000,
    deadline: '2026-09-30',
    official_notice_url: 'https://www.hdfcbank.com/personal/about-us/corporate-social-responsibility/parivartan',
    is_published: 1,
    rules: [
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '600000',
        is_mandatory: 1,
        rule_description: 'Family annual income must be less than or equal to ₹6,00,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '55.0',
        is_mandatory: 1,
        rule_description: 'Applicant must have scored at least 55% marks in previous year.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate, diploma, school',
        is_mandatory: 1,
        rule_description: 'Open to school and college students facing crisis.',
      },
    ],
    documents: [
      {
        document_name: 'Proof of Crisis / Emergency',
        is_mandatory: 1,
        instructions: 'Death certificate of earning parent or critical illness hospital report.',
      },
      {
        document_name: 'College / School Admission Slip & ID Card',
        is_mandatory: 1,
        instructions: 'Proof of active student status.',
      },
      {
        document_name: 'Previous Academic Year Marksheet',
        is_mandatory: 1,
        instructions: 'Marksheet showing at least 55% marks.',
      },
      {
        document_name: 'Income Proof / Affidavit',
        is_mandatory: 1,
        instructions: 'Income certificate or notarized salary affidavit.',
      },
      {
        document_name: 'Bank Account Passbook / Cancelled Cheque',
        is_mandatory: 1,
        instructions: 'Student or joint bank account details.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000008',
    name: 'Keep India Smiling Foundational Scholarship Programme',
    provider: 'Colgate-Palmolive (India) Limited & Buddy4Study',
    description:
      'Provides foundational support to deserving students to pursue higher education, diploma, or sports training without financial distress.',
    amount_description: '₹30,000 per year for up to 3 years',
    amount_value: 30000,
    deadline: '2026-10-30',
    official_notice_url: 'https://www.colgate.com/en-in/about/community-programs/keep-india-smiling',
    is_published: 1,
    rules: [
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '500000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹5,00,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '60.0',
        is_mandatory: 1,
        rule_description: 'Minimum 60% marks in Class 12 board examination.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, diploma',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in 3 or 4-year undergraduate degree / diploma.',
      },
    ],
    documents: [
      {
        document_name: 'Photo Identity Proof (Aadhaar / Voter ID)',
        is_mandatory: 1,
        instructions: 'Government issued photo identity.',
      },
      {
        document_name: 'Class 12th Board Marksheet',
        is_mandatory: 1,
        instructions: 'Showing minimum 60% aggregate marks.',
      },
      {
        document_name: 'Income Proof (ITR / Salary Slip / Income Certificate)',
        is_mandatory: 1,
        instructions: 'Proof of family income below ₹5,00,000.',
      },
      {
        document_name: 'College Admission Letter / Fee Receipt',
        is_mandatory: 1,
        instructions: 'Proof of undergraduate college enrollment.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000009',
    name: 'Kotak Kanya Scholarship for Girl Students in Higher Education',
    provider: 'Kotak Education Foundation',
    description:
      'Financial support to meritorious girl students from economically weaker sections to pursue professional graduation courses in top institutes.',
    amount_description: '₹1,50,000 per annum until completion of degree',
    amount_value: 150000,
    deadline: '2026-11-10',
    official_notice_url: 'https://kotak.kotakeducation.org/kotak-kanya-scholarship/',
    is_published: 1,
    rules: [
      {
        field_name: 'gender',
        operator: 'EQ',
        expected_value: 'female',
        is_mandatory: 1,
        rule_description: 'Exclusively open for female students.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '85.0',
        is_mandatory: 1,
        rule_description: 'Class 12 board marks must be 85% or above.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '600000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹6,00,000.',
      },
      {
        field_name: 'education_level',
        operator: 'EQ',
        expected_value: 'undergraduate',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in 1st year of professional degree program.',
      },
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Engineering, Medical, Architecture, Design, Law',
        is_mandatory: 1,
        rule_description: 'Applicable for Engineering, Medicine, Architecture, Design, or Law degrees.',
      },
    ],
    documents: [
      {
        document_name: 'Class 12th Board Marksheet',
        is_mandatory: 1,
        instructions: 'Showing at least 85% aggregate score.',
      },
      {
        document_name: 'Income Proof (Form 16 / ITR / Tehsildar Certificate)',
        is_mandatory: 1,
        instructions: 'Valid income document for the current assessment year.',
      },
      {
        document_name: 'College Admission Letter with Fee Structure',
        is_mandatory: 1,
        instructions: 'Showing official break-up of tuition and institutional fees.',
      },
      {
        document_name: 'Aadhaar Card',
        is_mandatory: 1,
        instructions: 'Self-attested Aadhaar card of the applicant.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000010',
    name: "L'Oréal India For Young Women in Science Scholarship",
    provider: "L'Oréal India Foundation",
    description:
      'A scholarship exclusively for young women wishing to pursue higher education in scientific fields, encouraging women representation in STEM.',
    amount_description: '₹2,50,000 total grant for undergraduate science education',
    amount_value: 250000,
    deadline: '2026-10-25',
    official_notice_url: 'https://www.loreal.com/en/india/articles/commitments/for-young-women-in-science/',
    is_published: 1,
    rules: [
      {
        field_name: 'gender',
        operator: 'EQ',
        expected_value: 'female',
        is_mandatory: 1,
        rule_description: 'Exclusively for female students.',
      },
      {
        field_name: 'education_level',
        operator: 'EQ',
        expected_value: 'undergraduate',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in undergraduate science/engineering stream.',
      },
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Science, Engineering, Medical, Biotechnology',
        is_mandatory: 1,
        rule_description: 'Must be pursuing Pure Science, Applied Science, Engineering, or Medicine.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '85.0',
        is_mandatory: 1,
        rule_description: 'Minimum 85% marks in Science stream (PCM / PCB / PCMB) in Class 12.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '600000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹6,00,000.',
      },
    ],
    documents: [
      {
        document_name: 'Class 10th and 12th Marksheets',
        is_mandatory: 1,
        instructions: 'Showing science stream grades and aggregate percentage >= 85%.',
      },
      {
        document_name: 'Proof of Family Income',
        is_mandatory: 1,
        instructions: 'Salary slip, ITR acknowledgment, or government income certificate.',
      },
      {
        document_name: 'College Admission Letter',
        is_mandatory: 1,
        instructions: 'Confirmation of enrollment in recognized science degree.',
      },
      {
        document_name: 'Science Teacher / Principal Recommendation Letter',
        is_mandatory: 1,
        instructions: 'Letter highlighting scientific interest and academic aptitude.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000011',
    name: "Prime Minister's Special Scholarship Scheme (PMSSS) for Engineering & Medicine",
    provider: 'All India Council for Technical Education (AICTE) & Ministry of Education',
    description:
      'Provides opportunities to youth of UTs of Jammu & Kashmir and Ladakh to pursue higher education in colleges outside J&K.',
    amount_description: '₹1,25,000 per annum academic fee + maintenance allowance',
    amount_value: 125000,
    deadline: '2026-11-20',
    official_notice_url: 'https://www.aicte-india.org/bureaus/pms',
    is_published: 1,
    rules: [
      {
        field_name: 'domicile_state',
        operator: 'IN',
        expected_value: 'Jammu and Kashmir, Ladakh',
        is_mandatory: 1,
        rule_description: 'Applicant must hold domicile of UT of Jammu & Kashmir or Ladakh.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '800000',
        is_mandatory: 1,
        rule_description: 'Annual family income must be within ₹8,00,000.',
      },
      {
        field_name: 'education_level',
        operator: 'EQ',
        expected_value: 'undergraduate',
        is_mandatory: 1,
        rule_description: 'Must be seeking admission into undergraduate professional degree.',
      },
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Engineering, Medical, Nursing, Pharmacy',
        is_mandatory: 1,
        rule_description: 'Applicable for Engineering, Medical, Nursing, and Pharmacy degrees.',
      },
    ],
    documents: [
      {
        document_name: 'Domicile Certificate of J&K / Ladakh',
        is_mandatory: 1,
        instructions: 'Official domicile certificate issued by competent authority.',
      },
      {
        document_name: 'Family Income Certificate',
        is_mandatory: 1,
        instructions: 'Certified by Tehsildar or competent revenue authority.',
      },
      {
        document_name: 'Class 12th Board Marksheet',
        is_mandatory: 1,
        instructions: 'Marksheet from JKBOSE or CBSE board.',
      },
      {
        document_name: 'AICTE Allotment / Verification Letter',
        is_mandatory: 1,
        instructions: 'AICTE PMSSS counseling allotment slip.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000012',
    name: 'North Eastern Council (NEC) Merit Scholarship for Professional Courses',
    provider: 'North Eastern Council (NEC), Ministry of DoNER',
    description:
      'Financial support to permanent residents of the 8 North-Eastern states enrolled in recognized professional higher education courses.',
    amount_description: '₹36,000 per annum for professional degree courses',
    amount_value: 36000,
    deadline: '2026-12-20',
    official_notice_url: 'https://necouncil.gov.in/schemes-programmes',
    is_published: 1,
    rules: [
      {
        field_name: 'domicile_state',
        operator: 'IN',
        expected_value: 'Assam, Arunachal Pradesh, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim',
        is_mandatory: 1,
        rule_description: 'Must be a permanent resident of any of the 8 North-Eastern States.',
      },
      {
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '7.0',
        is_mandatory: 1,
        rule_description: 'Minimum CGPA of 7.0 (or 70% aggregate marks).',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in undergraduate or postgraduate professional degree.',
      },
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Engineering, Medical, Agriculture, Technology, Science',
        is_mandatory: 1,
        rule_description: 'Engineering, Medicine, Agriculture, Veterinary, or Technology degree.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '800000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹8,00,000.',
      },
    ],
    documents: [
      {
        document_name: 'Permanent Resident Certificate (PRC)',
        is_mandatory: 1,
        instructions: 'Issued by District Magistrate / Sub-Divisional Officer of NE state.',
      },
      {
        document_name: 'Family Income Certificate',
        is_mandatory: 1,
        instructions: 'Current financial year certificate from Circle Officer / Tehsildar.',
      },
      {
        document_name: 'Previous Semester Marksheet / Degree Certificate',
        is_mandatory: 1,
        instructions: 'Marksheet showing at least 70% or 7.0 CGPA.',
      },
      {
        document_name: 'College Bonafide Certificate',
        is_mandatory: 1,
        instructions: 'Issued and stamped by Head of the Institution.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000013',
    name: "Prime Minister's Scholarship Scheme for Central Armed Police Forces (PMSS CAPF)",
    provider: 'Welfare & Rehabilitation Board (WARB), Ministry of Home Affairs',
    description:
      'Provides educational assistance to dependent wards and widows of Central Armed Police Forces (BSF, CRPF, CISF, ITBP, SSB) & Assam Rifles personnel pursuing professional degree courses.',
    amount_description: '₹36,000 per annum (₹3,000/mo for girls, ₹2,500/mo for boys)',
    amount_value: 36000,
    deadline: '2026-11-30',
    official_notice_url: 'https://scholarships.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in approved professional degree courses (Engineering, MBBS, Dental, Nursing, MBA, MCA).',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '60',
        is_mandatory: 1,
        rule_description: 'Must have secured at least 60% marks in 10+2 / Diploma / Graduation.',
      },
      {
        field_name: 'age',
        operator: 'LTE',
        expected_value: '25',
        is_mandatory: 1,
        rule_description: 'Applicant must be between 18 and 25 years of age.',
      },
    ],
    documents: [
      {
        document_name: 'Serving / Ex-Serviceman Certificate',
        is_mandatory: 1,
        instructions: 'Issued by the competent Force authority / WARB.',
      },
      {
        document_name: 'Bonafide Student Certificate',
        is_mandatory: 1,
        instructions: 'Issued by Registrar / Principal of the professional college.',
      },
      {
        document_name: '10+2 / Qualifying Marksheet',
        is_mandatory: 1,
        instructions: 'Self-attested copy of marksheet with minimum 60% aggregate.',
      },
      {
        document_name: 'Bank Passbook (Aadhaar linked)',
        is_mandatory: 1,
        instructions: 'Bank account in the name of student showing account number & IFSC.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000014',
    name: 'Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)',
    provider: 'Higher Education Department, Government of West Bengal',
    description:
      'Financial assistance to meritorious students from economically weaker sections domiciled in West Bengal to pursue Higher Secondary, Undergraduate, Postgraduate, and Professional studies.',
    amount_description: '₹18,000 to ₹60,000 per annum depending on course',
    amount_value: 18000,
    deadline: '2026-12-31',
    official_notice_url: 'https://svmcm.wbhed.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'domicile_state',
        operator: 'EQ',
        expected_value: 'West Bengal',
        is_mandatory: 1,
        rule_description: 'Applicant must be a permanent resident of West Bengal.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '250000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹2,50,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '60',
        is_mandatory: 1,
        rule_description: 'Minimum 60% aggregate marks in the last board / university qualifying examination.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate, diploma, school',
        is_mandatory: 1,
        rule_description: 'Enrolled in post-matric higher secondary, undergraduate, or postgraduate level.',
      },
    ],
    documents: [
      {
        document_name: 'Income Certificate',
        is_mandatory: 1,
        instructions: 'Issued by BDO / SDO / Joint BDO / Executive Officer of Municipality.',
      },
      {
        document_name: 'Domicile Certificate',
        is_mandatory: 1,
        instructions: 'Aadhaar card, Voter card, or Ration card showing West Bengal address.',
      },
      {
        document_name: 'Last Qualifying Examination Marksheet',
        is_mandatory: 1,
        instructions: 'Both sides of the marksheet showing 60%+ aggregate.',
      },
      {
        document_name: 'Admission Receipt',
        is_mandatory: 1,
        instructions: 'Receipt of admission fees for current academic year.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000015',
    name: 'Tata Trusts Medical and Healthcare Scholarship',
    provider: 'Tata Trusts',
    description:
      'Need-based financial assistance for meritorious students pursuing undergraduate and postgraduate studies in Medical Sciences, BDS, Pharmacy, and Allied Healthcare in recognized Indian institutions.',
    amount_description: 'Up to ₹50,000 per academic year towards tuition fees',
    amount_value: 50000,
    deadline: '2026-10-31',
    official_notice_url: 'https://www.tatatrusts.org',
    is_published: 1,
    rules: [
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Medicine, Healthcare, Pharmacy, Nursing, Medical Sciences',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in MBBS, BDS, Nursing, Pharmacy, or Allied Health Sciences.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate',
        is_mandatory: 1,
        rule_description: 'Must be pursuing a full-time undergraduate or postgraduate healthcare degree.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '600000',
        is_mandatory: 1,
        rule_description: 'Gross annual family income must be ≤ ₹6,00,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '65',
        is_mandatory: 1,
        rule_description: 'Must have secured minimum 65% in Class 12 / previous professional exam.',
      },
    ],
    documents: [
      {
        document_name: 'NEET Scorecard / College Admission Allotment',
        is_mandatory: 1,
        instructions: 'Proof of admission into recognized government or private medical college.',
      },
      {
        document_name: 'Family Income Proof (ITR / Form 16)',
        is_mandatory: 1,
        instructions: 'Latest ITR or employer salary slip of earning parents.',
      },
      {
        document_name: 'College Fee Structure',
        is_mandatory: 1,
        instructions: 'Official fee breakdown signed by college authority.',
      },
      {
        document_name: 'Previous Academic Marksheets',
        is_mandatory: 1,
        instructions: 'Class 12th board marksheet and semester results.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000016',
    name: 'ICAR National Talent Scholarship (NTS) for Agriculture & Allied Sciences',
    provider: 'Indian Council of Agricultural Research (ICAR), Govt. of India',
    description:
      'Awarded to meritorious students who take admission in State Agricultural Universities and Central Agricultural Universities outside their home state through All India Entrance Examination.',
    amount_description: '₹36,000 per annum (₹3,000 per month for UG students)',
    amount_value: 36000,
    deadline: '2026-11-20',
    official_notice_url: 'https://icar.org.in',
    is_published: 1,
    rules: [
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Agriculture, Horticulture, Forestry, Veterinary Science, Fisheries, Agricultural Engineering',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in an Agriculture or Allied Sciences degree.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate',
        is_mandatory: 1,
        rule_description: 'Enrolled in B.Sc (Hons) Agriculture / Allied or M.Sc programs.',
      },
      {
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '7.0',
        is_mandatory: 1,
        rule_description: 'Must maintain minimum 7.0 / 10.0 OGPA in agricultural university exams.',
      },
    ],
    documents: [
      {
        document_name: 'ICAR Allotment Letter',
        is_mandatory: 1,
        instructions: 'Proof of admission through ICAR All-India quota seat.',
      },
      {
        document_name: 'University Bonafide Certificate',
        is_mandatory: 1,
        instructions: 'Signed by Registrar of the Agricultural University.',
      },
      {
        document_name: 'Semester Grade Report',
        is_mandatory: 1,
        instructions: 'Proving minimum 7.0 OGPA / CGPA maintenance.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000017',
    name: 'Post-Matric Scholarship Scheme for Minorities (MoMA)',
    provider: 'Ministry of Minority Affairs, Government of India',
    description:
      'Empowers students belonging to notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) to pursue higher education from Class 11 up to Ph.D. stage.',
    amount_description: '₹20,000 per annum + Maintenance Allowance',
    amount_value: 20000,
    deadline: '2026-11-30',
    official_notice_url: 'https://scholarships.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '200000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹2,00,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '50',
        is_mandatory: 1,
        rule_description: 'Minimum 50% marks in the previous final board / degree examination.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'school, undergraduate, postgraduate, diploma',
        is_mandatory: 1,
        rule_description: 'Studying in Class 11, 12, Diploma, ITI, Undergraduate, or Postgraduate level.',
      },
    ],
    documents: [
      {
        document_name: 'Minority Community Self-Declaration',
        is_mandatory: 1,
        instructions: 'Self-declaration affidavit of belonging to notified minority community.',
      },
      {
        document_name: 'Income Certificate',
        is_mandatory: 1,
        instructions: 'Issued by authorized Revenue Officer / Tehsildar.',
      },
      {
        document_name: 'Previous Examination Marksheet',
        is_mandatory: 1,
        instructions: 'Showing minimum 50% aggregate score.',
      },
      {
        document_name: 'Fee Receipt of Current Course',
        is_mandatory: 1,
        instructions: 'Official receipt acknowledging payment of institutional fees.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000018',
    name: 'Aditya Birla Capital Scholarship for Professional Degree Students',
    provider: 'Aditya Birla Capital Foundation',
    description:
      'Provides financial support to meritorious students enrolled in professional undergraduate courses (Engineering, Commerce, Management, and Law) across India.',
    amount_description: '₹60,000 one-time financial grant',
    amount_value: 60000,
    deadline: '2026-10-15',
    official_notice_url: 'https://www.adityabirlacapital.com',
    is_published: 1,
    rules: [
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '600000',
        is_mandatory: 1,
        rule_description: 'Gross annual family income must be ≤ ₹6,00,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '60',
        is_mandatory: 1,
        rule_description: 'Must have scored at least 60% in Class 12 or preceding year.',
      },
      {
        field_name: 'education_level',
        operator: 'EQ',
        expected_value: 'undergraduate',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in full-time professional UG degree (B.Tech, B.Com, BBA, BA LLB).',
      },
    ],
    documents: [
      {
        document_name: 'Government ID Proof',
        is_mandatory: 1,
        instructions: 'Aadhaar card or Voter ID of student.',
      },
      {
        document_name: 'Income Certificate / Salary Slips',
        is_mandatory: 1,
        instructions: 'Issued by competent authority or recent 3 months salary slips.',
      },
      {
        document_name: 'College Admission Letter & ID Card',
        is_mandatory: 1,
        instructions: 'Current student ID card and admission proof.',
      },
      {
        document_name: 'Bank Account Passbook / Cancelled Cheque',
        is_mandatory: 1,
        instructions: 'Student savings account in any scheduled bank.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000019',
    name: 'Dr. Ambedkar Post-Matric Scholarship for Economically Backward Classes (EBC)',
    provider: 'Ministry of Social Justice & Empowerment, Govt. of India',
    description:
      'Centrally sponsored scheme designed for general/non-reserved category students belonging to economically backward classes (EBC) pursuing post-matriculation studies.',
    amount_description: '₹15,000 per annum + Compulsory Non-Refundable Fee reimbursement',
    amount_value: 15000,
    deadline: '2026-12-15',
    official_notice_url: 'https://socialjustice.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'category',
        operator: 'IN',
        expected_value: 'General, EWS',
        is_mandatory: 1,
        rule_description: 'Must belong to General Category or Economically Weaker Section (EWS).',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '100000',
        is_mandatory: 1,
        rule_description: 'Annual family income from all sources must not exceed ₹1,00,000.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate, diploma',
        is_mandatory: 1,
        rule_description: 'Studying in recognized post-matric course at a recognized college.',
      },
    ],
    documents: [
      {
        document_name: 'Income Certificate',
        is_mandatory: 1,
        instructions: 'Issued by Revenue Authority not below the rank of Tehsildar.',
      },
      {
        document_name: 'EBC / General Category Declaration',
        is_mandatory: 1,
        instructions: 'Self-affidavit confirming non-reserved category status.',
      },
      {
        document_name: 'Marksheet of Qualifying Examination',
        is_mandatory: 1,
        instructions: 'Proof of having passed the previous academic milestone.',
      },
      {
        document_name: 'Institutional Bonafide Certificate',
        is_mandatory: 1,
        instructions: 'Signed by Principal or Head of Institution.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000020',
    name: 'Google Generation Scholarship (APAC) for Women in Computer Science',
    provider: 'Google Inc.',
    description:
      'Supports women studying computer science and gaming to become leaders in tech, providing tuition scholarship and access to Google networking retreats.',
    amount_description: '₹2,00,000 ($2,500 USD equivalent tuition award)',
    amount_value: 200000,
    deadline: '2026-11-01',
    official_notice_url: 'https://buildyourfuture.withgoogle.com/scholarships',
    is_published: 1,
    rules: [
      {
        field_name: 'gender',
        operator: 'EQ',
        expected_value: 'female',
        is_mandatory: 1,
        rule_description: 'Must identify as a female student.',
      },
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Engineering, Computer Science, Information Technology, AI',
        is_mandatory: 1,
        rule_description: 'Must be studying Computer Science, Computer Engineering, or related technical field.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in 1st, 2nd, or 3rd year of undergraduate or postgraduate studies.',
      },
      {
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '7.5',
        is_mandatory: 1,
        rule_description: 'Strong academic record with minimum 7.5 CGPA / equivalent.',
      },
    ],
    documents: [
      {
        document_name: 'Resume / CV',
        is_mandatory: 1,
        instructions: 'Detailing technical projects, coding skills, and community work.',
      },
      {
        document_name: 'Current Academic Transcript',
        is_mandatory: 1,
        instructions: 'Official semester transcript showing CGPA ≥ 7.5.',
      },
      {
        document_name: 'Diversity and Tech Leadership Essay',
        is_mandatory: 1,
        instructions: 'Essay responses explaining passion for computer science and diversity in tech.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000021',
    name: 'National Law Universities (NLU) Need-Cum-Merit Legal Scholarship',
    provider: 'Bar Council of India Trust & Department of Justice',
    description:
      'Financial assistance for underprivileged and deserving law students admitted to 5-year integrated BA LLB / BBA LLB courses in recognized National Law Universities.',
    amount_description: '₹75,000 per annum towards hostel and tuition fees',
    amount_value: 75000,
    deadline: '2026-10-30',
    official_notice_url: 'https://doj.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Law, Legal Studies, Law & Legal Studies',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in an approved full-time law program (BA LLB / BBA LLB / LLM).',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate',
        is_mandatory: 1,
        rule_description: 'Must be studying in an undergraduate or postgraduate law course.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '500000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹5,00,000.',
      },
      {
        field_name: 'cgpa',
        operator: 'GTE',
        expected_value: '6.5',
        is_mandatory: 1,
        rule_description: 'Must maintain minimum 6.5 CGPA in university semester examinations.',
      },
    ],
    documents: [
      {
        document_name: 'CLAT / AILET Admission Scorecard & Allotment',
        is_mandatory: 1,
        instructions: 'Proof of entrance examination rank and NLU admission letter.',
      },
      {
        document_name: 'Parental Income Certificate',
        is_mandatory: 1,
        instructions: 'Issued by competent revenue authority or ITR statement.',
      },
      {
        document_name: 'College ID Card & Bonafide Certificate',
        is_mandatory: 1,
        instructions: 'Signed by Dean / Registrar of the National Law University.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000022',
    name: 'Mahindra All India Talent Scholarship (MAITS) for Polytechnic Diploma',
    provider: 'K. C. Mahindra Education Trust',
    description:
      'Awarded to deserving students from rural and economically weaker backgrounds who have secured admission in government-recognized Polytechnic Diploma institutes.',
    amount_description: '₹10,000 per annum for 3 years (₹30,000 total)',
    amount_value: 10000,
    deadline: '2026-09-30',
    official_notice_url: 'https://www.kcmet.org',
    is_published: 1,
    rules: [
      {
        field_name: 'education_level',
        operator: 'EQ',
        expected_value: 'diploma',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in a recognized 3-year Polytechnic Diploma course.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '150000',
        is_mandatory: 1,
        rule_description: 'Annual family income must be less than ₹1,50,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '60',
        is_mandatory: 1,
        rule_description: 'Passed 10th or 12th standard with minimum 60% aggregate marks.',
      },
    ],
    documents: [
      {
        document_name: '10th / 12th Board Marksheet',
        is_mandatory: 1,
        instructions: 'Certified copy of marksheet showing minimum 60%.',
      },
      {
        document_name: 'Polytechnic Admission Letter / Fee Receipt',
        is_mandatory: 1,
        instructions: 'Proof of admission to 1st year diploma engineering course.',
      },
      {
        document_name: 'Family Income Proof',
        is_mandatory: 1,
        instructions: 'BDO / Tehsildar certificate or BPL card copy.',
      },
      {
        document_name: 'Student Bank Passbook',
        is_mandatory: 1,
        instructions: 'Copy of front page of bank account.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000023',
    name: 'NHFDC Trust Fund Scholarship for Students with Disabilities',
    provider: 'Department of Empowerment of Persons with Disabilities, Govt. of India',
    description:
      'Trust Fund scholarship for differently-abled students pursuing professional or technical degree and postgraduate courses from recognized Indian universities.',
    amount_description: '₹48,000 per annum (₹3,000/mo maintenance + ₹12,000/yr book grant)',
    amount_value: 48000,
    deadline: '2026-11-15',
    official_notice_url: 'https://www.nhfdc.nic.in',
    is_published: 1,
    rules: [
      {
        field_name: 'is_pwd',
        operator: 'EQ',
        expected_value: '1',
        is_mandatory: 1,
        rule_description: 'Applicant must be a person with benchmark disability (40% or more).',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '300000',
        is_mandatory: 1,
        rule_description: 'Gross annual family income must not exceed ₹3,00,000.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate, diploma',
        is_mandatory: 1,
        rule_description: 'Enrolled in professional or technical degree / diploma programs.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '50',
        is_mandatory: 1,
        rule_description: 'Minimum 50% marks in the qualifying board or degree examination.',
      },
    ],
    documents: [
      {
        document_name: 'Disability Certificate (UDID Card)',
        is_mandatory: 1,
        instructions: 'Government UDID card or medical board certificate showing ≥40% disability.',
      },
      {
        document_name: 'Income Certificate',
        is_mandatory: 1,
        instructions: 'Issued by authorized Revenue Officer / Tehsildar.',
      },
      {
        document_name: 'University Bonafide Certificate',
        is_mandatory: 1,
        instructions: 'Signed by Dean / Principal confirming current full-time enrollment.',
      },
      {
        document_name: 'Previous Marksheet',
        is_mandatory: 1,
        instructions: 'Proof of scoring at least 50% in qualifying examination.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000024',
    name: 'DCE Kerala Suvarna Jubilee Merit Scholarship',
    provider: 'Directorate of Collegiate Education, Government of Kerala',
    description:
      'State merit-cum-means scholarship for first-year undergraduate and postgraduate students from Below Poverty Line (BPL) families in Kerala.',
    amount_description: '₹10,000 per annum',
    amount_value: 10000,
    deadline: '2026-11-25',
    official_notice_url: 'https://dcescholarship.kerala.gov.in',
    is_published: 1,
    rules: [
      {
        field_name: 'domicile_state',
        operator: 'EQ',
        expected_value: 'Kerala',
        is_mandatory: 1,
        rule_description: 'Applicant must be a native / permanent resident of Kerala.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '100000',
        is_mandatory: 1,
        rule_description: 'Belonging to BPL category or annual family income ≤ ₹1,00,000.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '50',
        is_mandatory: 1,
        rule_description: 'Must have secured minimum 50% in Plus-Two or Degree exam.',
      },
      {
        field_name: 'education_level',
        operator: 'IN',
        expected_value: 'undergraduate, postgraduate',
        is_mandatory: 1,
        rule_description: 'Enrolled in regular UG or PG course in a recognized college in Kerala.',
      },
    ],
    documents: [
      {
        document_name: 'Kerala Nativity / Domicile Certificate',
        is_mandatory: 1,
        instructions: 'Issued by Village Officer / Tehsildar.',
      },
      {
        document_name: 'BPL Ration Card / Income Certificate',
        is_mandatory: 1,
        instructions: 'Showing BPL category or income ≤ ₹1,00,000.',
      },
      {
        document_name: 'Qualifying Marksheet',
        is_mandatory: 1,
        instructions: 'Plus Two or Degree examination marksheet.',
      },
      {
        document_name: 'Student Bank Passbook',
        is_mandatory: 1,
        instructions: 'First page of savings bank account passbook.',
      },
    ],
  },
  {
    id: 'a1000000-0000-0000-0000-000000000025',
    name: 'Infosys Foundation "Aarohan" Social Innovation and STEM Scholarship',
    provider: 'Infosys Foundation',
    description:
      'Promotes social innovation and educational equity by providing comprehensive tuition assistance to deserving students from rural and semi-urban communities enrolled in STEM and design degrees.',
    amount_description: '₹1,00,000 per annum for tuition & living costs',
    amount_value: 100000,
    deadline: '2026-10-31',
    official_notice_url: 'https://www.infosys.com/infosys-foundation',
    is_published: 1,
    rules: [
      {
        field_name: 'area_type',
        operator: 'EQ',
        expected_value: 'rural',
        is_mandatory: 1,
        rule_description: 'Must belong to a rural village or gram panchayat jurisdiction.',
      },
      {
        field_name: 'family_income',
        operator: 'LTE',
        expected_value: '450000',
        is_mandatory: 1,
        rule_description: 'Annual family income must not exceed ₹4,50,000.',
      },
      {
        field_name: 'field_of_study',
        operator: 'IN',
        expected_value: 'Engineering, Science, Computer Science, Architecture, STEM',
        is_mandatory: 1,
        rule_description: 'Enrolled in STEM, Engineering, Computer Science, or Architecture.',
      },
      {
        field_name: 'education_level',
        operator: 'EQ',
        expected_value: 'undergraduate',
        is_mandatory: 1,
        rule_description: 'Must be enrolled in a 4-year undergraduate degree program.',
      },
      {
        field_name: 'previous_marks_percentage',
        operator: 'GTE',
        expected_value: '70',
        is_mandatory: 1,
        rule_description: 'Minimum 70% in Class 12 board examination.',
      },
    ],
    documents: [
      {
        document_name: 'Rural Residence Certificate',
        is_mandatory: 1,
        instructions: 'Issued by Gram Panchayat Pradhan or BDO.',
      },
      {
        document_name: 'Family Income Certificate',
        is_mandatory: 1,
        instructions: 'Income certificate issued by Tehsildar.',
      },
      {
        document_name: 'Class 12 Board Certificate & Marksheet',
        is_mandatory: 1,
        instructions: 'Showing aggregate percentage ≥ 70%.',
      },
      {
        document_name: 'College Admission Allotment Letter & Fee Receipt',
        is_mandatory: 1,
        instructions: 'Proof of admission into undergraduate STEM course.',
      },
    ],
  },
];

export interface DemoUserSeed {
  id: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
  profile?: {
    full_name: string;
    age: number;
    gender: Gender;
    family_income: number;
    education_level: EducationLevel;
    current_course: string;
    field_of_study: string;
    cgpa: number;
    domicile_state: string;
    area_type: AreaType;
    category: SocialCategory;
    is_pwd: number;
    previous_institution?: string;
    previous_marks_percentage?: number;
  };
}

export const DEMO_USERS: DemoUserSeed[] = [
  {
    id: 'u1000000-0000-0000-0000-000000000001',
    email: 'admin@scholarships.gov.in',
    password: 'Admin@12345',
    role: 'admin',
  },
  {
    id: 'u1000000-0000-0000-0000-000000000002',
    email: 'student1@test.com',
    password: 'Student@12345',
    role: 'student',
    profile: {
      full_name: 'Ananya Sharma',
      age: 20,
      gender: 'female',
      family_income: 320000,
      education_level: 'undergraduate',
      current_course: 'B.Tech Computer Science',
      field_of_study: 'Engineering',
      cgpa: 8.4,
      domicile_state: 'Assam',
      area_type: 'urban',
      category: 'General',
      is_pwd: 0,
      previous_institution: 'Cotton University Senior Secondary',
      previous_marks_percentage: 88.5,
    },
  },
  {
    id: 'u1000000-0000-0000-0000-000000000003',
    email: 'student2@test.com',
    password: 'Student@12345',
    role: 'student',
    // Incomplete profile for testing onboarding
  },
];

/**
 * Programmatically seed the D1 database
 */
export async function seedDatabase(db: D1Database): Promise<{ users: number; scholarships: number }> {
  const now = new Date().toISOString();

  // 1. Seed Users and Profiles
  for (const user of DEMO_USERS) {
    const passwordHash = await hashPassword(user.password);

    await db.prepare(
      `INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         email = excluded.email,
         password_hash = excluded.password_hash,
         role = excluded.role,
         updated_at = excluded.updated_at`
    )
      .bind(user.id, user.email.toLowerCase(), passwordHash, user.role, now, now)
      .run();

    if (user.profile) {
      await db.prepare(
        `INSERT INTO student_profiles (
          user_id, full_name, age, gender, family_income,
          education_level, current_course, field_of_study, cgpa,
          domicile_state, area_type, category, is_pwd,
          previous_institution, previous_marks_percentage, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          full_name = excluded.full_name,
          age = excluded.age,
          gender = excluded.gender,
          family_income = excluded.family_income,
          education_level = excluded.education_level,
          current_course = excluded.current_course,
          field_of_study = excluded.field_of_study,
          cgpa = excluded.cgpa,
          domicile_state = excluded.domicile_state,
          area_type = excluded.area_type,
          category = excluded.category,
          is_pwd = excluded.is_pwd,
          previous_institution = excluded.previous_institution,
          previous_marks_percentage = excluded.previous_marks_percentage,
          updated_at = excluded.updated_at`
      )
        .bind(
          user.id,
          user.profile.full_name,
          user.profile.age,
          user.profile.gender,
          user.profile.family_income,
          user.profile.education_level,
          user.profile.current_course,
          user.profile.field_of_study,
          user.profile.cgpa,
          user.profile.domicile_state,
          user.profile.area_type,
          user.profile.category,
          user.profile.is_pwd,
          user.profile.previous_institution || null,
          user.profile.previous_marks_percentage || null,
          now
        )
        .run();
    }
  }

  // 2. Seed Scholarships, Rules, Documents
  for (const s of SEED_SCHOLARSHIPS) {
    await db.prepare(
      `INSERT INTO scholarships (
        id, name, provider, description, amount_description,
        amount_value, deadline, official_notice_url, created_by,
        is_published, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        provider = excluded.provider,
        description = excluded.description,
        amount_description = excluded.amount_description,
        amount_value = excluded.amount_value,
        deadline = excluded.deadline,
        official_notice_url = excluded.official_notice_url,
        is_published = excluded.is_published,
        updated_at = excluded.updated_at`
    )
      .bind(
        s.id,
        s.name,
        s.provider,
        s.description,
        s.amount_description,
        s.amount_value,
        s.deadline,
        s.official_notice_url,
        'u1000000-0000-0000-0000-000000000001',
        s.is_published,
        now,
        now
      )
      .run();

    // Re-seed rules
    await db.prepare('DELETE FROM eligibility_rules WHERE scholarship_id = ?').bind(s.id).run();
    for (const rule of s.rules) {
      const ruleId = crypto.randomUUID();
      await db.prepare(
        `INSERT INTO eligibility_rules (
          id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          ruleId,
          s.id,
          rule.field_name,
          rule.operator,
          rule.expected_value,
          rule.is_mandatory,
          rule.rule_description,
          now
        )
        .run();
    }

    // Re-seed documents
    await db.prepare('DELETE FROM scholarship_documents WHERE scholarship_id = ?').bind(s.id).run();
    for (const doc of s.documents) {
      const docId = crypto.randomUUID();
      await db.prepare(
        `INSERT INTO scholarship_documents (
          id, scholarship_id, document_name, is_mandatory, instructions
        ) VALUES (?, ?, ?, ?, ?)`
      )
        .bind(docId, s.id, doc.document_name, doc.is_mandatory, doc.instructions)
        .run();
    }
  }

  return { users: DEMO_USERS.length, scholarships: SEED_SCHOLARSHIPS.length };
}
