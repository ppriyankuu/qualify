-- 0003_add_more_scholarships.sql
-- Seed 13 additional diverse scholarships into qualify-db (bringing total to 25)
-- Safe & idempotent: uses ON CONFLICT and deterministic IDs.

-- =========================================================================
-- 13. Prime Minister's Scholarship Scheme for Central Armed Police Forces (PMSS CAPF)
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000013',
  'Prime Minister''s Scholarship Scheme for Central Armed Police Forces (PMSS CAPF)',
  'Welfare & Rehabilitation Board (WARB), Ministry of Home Affairs',
  'Provides educational assistance to dependent wards and widows of Central Armed Police Forces (BSF, CRPF, CISF, ITBP, SSB) & Assam Rifles personnel pursuing professional degree courses.',
  '₹36,000 per annum (₹3,000/mo for girls, ₹2,500/mo for boys)',
  36000,
  '2026-11-30',
  'https://scholarships.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000013';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000131', 'a1000000-0000-0000-0000-000000000013', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be enrolled in approved professional degree courses (Engineering, MBBS, Dental, Nursing, MBA, MCA).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000132', 'a1000000-0000-0000-0000-000000000013', 'previous_marks_percentage', 'GTE', '60', 1, 'Must have secured at least 60% marks in 10+2 / Diploma / Graduation.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000133', 'a1000000-0000-0000-0000-000000000013', 'age', 'LTE', '25', 1, 'Applicant must be between 18 and 25 years of age.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000013';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000131', 'a1000000-0000-0000-0000-000000000013', 'Serving / Ex-Serviceman Certificate', 1, 'Issued by the competent Force authority / WARB.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000132', 'a1000000-0000-0000-0000-000000000013', 'Bonafide Student Certificate', 1, 'Issued by Registrar / Principal of the professional college.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000133', 'a1000000-0000-0000-0000-000000000013', '10+2 / Qualifying Marksheet', 1, 'Self-attested copy of marksheet with minimum 60% aggregate.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000134', 'a1000000-0000-0000-0000-000000000013', 'Bank Passbook (Aadhaar linked)', 1, 'Bank account in the name of student showing account number & IFSC.');


-- =========================================================================
-- 14. Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000014',
  'Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)',
  'Higher Education Department, Government of West Bengal',
  'Financial assistance to meritorious students from economically weaker sections domiciled in West Bengal to pursue Higher Secondary, Undergraduate, Postgraduate, and Professional studies.',
  '₹18,000 to ₹60,000 per annum depending on course',
  18000,
  '2026-12-31',
  'https://svmcm.wbhed.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000014';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000141', 'a1000000-0000-0000-0000-000000000014', 'domicile_state', 'EQ', 'West Bengal', 1, 'Applicant must be a permanent resident of West Bengal.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000142', 'a1000000-0000-0000-0000-000000000014', 'family_income', 'LTE', '250000', 1, 'Annual family income must not exceed ₹2,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000143', 'a1000000-0000-0000-0000-000000000014', 'previous_marks_percentage', 'GTE', '60', 1, 'Minimum 60% aggregate marks in the last board / university qualifying examination.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000144', 'a1000000-0000-0000-0000-000000000014', 'education_level', 'IN', 'undergraduate, postgraduate, diploma, school', 1, 'Enrolled in post-matric higher secondary, undergraduate, or postgraduate level.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000014';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000141', 'a1000000-0000-0000-0000-000000000014', 'Income Certificate', 1, 'Issued by BDO / SDO / Joint BDO / Executive Officer of Municipality.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000142', 'a1000000-0000-0000-0000-000000000014', 'Domicile Certificate', 1, 'Aadhaar card, Voter card, or Ration card showing West Bengal address.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000143', 'a1000000-0000-0000-0000-000000000014', 'Last Qualifying Examination Marksheet', 1, 'Both sides of the marksheet showing 60%+ aggregate.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000144', 'a1000000-0000-0000-0000-000000000014', 'Admission Receipt', 1, 'Receipt of admission fees for current academic year.');


-- =========================================================================
-- 15. Tata Trusts Medical and Healthcare Scholarship
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000015',
  'Tata Trusts Medical and Healthcare Scholarship',
  'Tata Trusts',
  'Need-based financial assistance for meritorious students pursuing undergraduate and postgraduate studies in Medical Sciences, BDS, Pharmacy, and Allied Healthcare in recognized Indian institutions.',
  'Up to ₹50,000 per academic year towards tuition fees',
  50000,
  '2026-10-31',
  'https://www.tatatrusts.org',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000015';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000151', 'a1000000-0000-0000-0000-000000000015', 'field_of_study', 'IN', 'Medicine, Healthcare, Pharmacy, Nursing, Medical Sciences', 1, 'Must be enrolled in MBBS, BDS, Nursing, Pharmacy, or Allied Health Sciences.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000152', 'a1000000-0000-0000-0000-000000000015', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be pursuing a full-time undergraduate or postgraduate healthcare degree.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000153', 'a1000000-0000-0000-0000-000000000015', 'family_income', 'LTE', '600000', 1, 'Gross annual family income must be ≤ ₹6,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000154', 'a1000000-0000-0000-0000-000000000015', 'previous_marks_percentage', 'GTE', '65', 1, 'Must have secured minimum 65% in Class 12 / previous professional exam.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000015';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000151', 'a1000000-0000-0000-0000-000000000015', 'NEET Scorecard / College Admission Allotment', 1, 'Proof of admission into recognized government or private medical college.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000152', 'a1000000-0000-0000-0000-000000000015', 'Family Income Proof (ITR / Form 16)', 1, 'Latest ITR or employer salary slip of earning parents.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000153', 'a1000000-0000-0000-0000-000000000015', 'College Fee Structure', 1, 'Official fee breakdown signed by college authority.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000154', 'a1000000-0000-0000-0000-000000000015', 'Previous Academic Marksheets', 1, 'Class 12th board marksheet and semester results.');


-- =========================================================================
-- 16. ICAR National Talent Scholarship (NTS) for Agriculture & Allied Sciences
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000016',
  'ICAR National Talent Scholarship (NTS) for Agriculture & Allied Sciences',
  'Indian Council of Agricultural Research (ICAR), Govt. of India',
  'Awarded to meritorious students who take admission in State Agricultural Universities and Central Agricultural Universities outside their home state through All India Entrance Examination.',
  '₹36,000 per annum (₹3,000 per month for UG students)',
  36000,
  '2026-11-20',
  'https://icar.org.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000016';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000161', 'a1000000-0000-0000-0000-000000000016', 'field_of_study', 'IN', 'Agriculture, Horticulture, Forestry, Veterinary Science, Fisheries, Agricultural Engineering', 1, 'Must be enrolled in an Agriculture or Allied Sciences degree.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000162', 'a1000000-0000-0000-0000-000000000016', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Enrolled in B.Sc (Hons) Agriculture / Allied or M.Sc programs.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000163', 'a1000000-0000-0000-0000-000000000016', 'cgpa', 'GTE', '7.0', 1, 'Must maintain minimum 7.0 / 10.0 OGPA in agricultural university exams.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000016';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000161', 'a1000000-0000-0000-0000-000000000016', 'ICAR Allotment Letter', 1, 'Proof of admission through ICAR All-India quota seat.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000162', 'a1000000-0000-0000-0000-000000000016', 'University Bonafide Certificate', 1, 'Signed by Registrar of the Agricultural University.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000163', 'a1000000-0000-0000-0000-000000000016', 'Semester Grade Report', 1, 'Proving minimum 7.0 OGPA / CGPA maintenance.');


-- =========================================================================
-- 17. Post-Matric Scholarship Scheme for Minorities (MoMA)
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000017',
  'Post-Matric Scholarship Scheme for Minorities (MoMA)',
  'Ministry of Minority Affairs, Government of India',
  'Empowers students belonging to notified minority communities (Muslim, Christian, Sikh, Buddhist, Jain, Parsi) to pursue higher education from Class 11 up to Ph.D. stage.',
  '₹20,000 per annum + Maintenance Allowance',
  20000,
  '2026-11-30',
  'https://scholarships.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000017';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000171', 'a1000000-0000-0000-0000-000000000017', 'family_income', 'LTE', '200000', 1, 'Annual family income must not exceed ₹2,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000172', 'a1000000-0000-0000-0000-000000000017', 'previous_marks_percentage', 'GTE', '50', 1, 'Minimum 50% marks in the previous final board / degree examination.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000173', 'a1000000-0000-0000-0000-000000000017', 'education_level', 'IN', 'school, undergraduate, postgraduate, diploma', 1, 'Studying in Class 11, 12, Diploma, ITI, Undergraduate, or Postgraduate level.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000017';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000171', 'a1000000-0000-0000-0000-000000000017', 'Minority Community Self-Declaration', 1, 'Self-declaration affidavit of belonging to notified minority community.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000172', 'a1000000-0000-0000-0000-000000000017', 'Income Certificate', 1, 'Issued by authorized Revenue Officer / Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000173', 'a1000000-0000-0000-0000-000000000017', 'Previous Examination Marksheet', 1, 'Showing minimum 50% aggregate score.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000174', 'a1000000-0000-0000-0000-000000000017', 'Fee Receipt of Current Course', 1, 'Official receipt acknowledging payment of institutional fees.');


-- =========================================================================
-- 18. Aditya Birla Capital Scholarship for Professional Degree Students
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000018',
  'Aditya Birla Capital Scholarship for Professional Degree Students',
  'Aditya Birla Capital Foundation',
  'Provides financial support to meritorious students enrolled in professional undergraduate courses (Engineering, Commerce, Management, and Law) across India.',
  '₹60,000 one-time financial grant',
  60000,
  '2026-10-15',
  'https://www.adityabirlacapital.com',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000018';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000181', 'a1000000-0000-0000-0000-000000000018', 'family_income', 'LTE', '600000', 1, 'Gross annual family income must be ≤ ₹6,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000182', 'a1000000-0000-0000-0000-000000000018', 'previous_marks_percentage', 'GTE', '60', 1, 'Must have scored at least 60% in Class 12 or preceding year.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000183', 'a1000000-0000-0000-0000-000000000018', 'education_level', 'EQ', 'undergraduate', 1, 'Must be enrolled in full-time professional UG degree (B.Tech, B.Com, BBA, BA LLB).');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000018';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000181', 'a1000000-0000-0000-0000-000000000018', 'Government ID Proof', 1, 'Aadhaar card or Voter ID of student.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000182', 'a1000000-0000-0000-0000-000000000018', 'Income Certificate / Salary Slips', 1, 'Issued by competent authority or recent 3 months salary slips.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000183', 'a1000000-0000-0000-0000-000000000018', 'College Admission Letter & ID Card', 1, 'Current student ID card and admission proof.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000184', 'a1000000-0000-0000-0000-000000000018', 'Bank Account Passbook / Cancelled Cheque', 1, 'Student savings account in any scheduled bank.');


-- =========================================================================
-- 19. Dr. Ambedkar Post-Matric Scholarship for Economically Backward Classes (EBC)
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000019',
  'Dr. Ambedkar Post-Matric Scholarship for Economically Backward Classes (EBC)',
  'Ministry of Social Justice & Empowerment, Govt. of India',
  'Centrally sponsored scheme designed for general/non-reserved category students belonging to economically backward classes (EBC) pursuing post-matriculation studies.',
  '₹15,000 per annum + Compulsory Non-Refundable Fee reimbursement',
  15000,
  '2026-12-15',
  'https://socialjustice.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000019';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000191', 'a1000000-0000-0000-0000-000000000019', 'category', 'IN', 'General, EWS', 1, 'Must belong to General Category or Economically Weaker Section (EWS).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000192', 'a1000000-0000-0000-0000-000000000019', 'family_income', 'LTE', '100000', 1, 'Annual family income from all sources must not exceed ₹1,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000193', 'a1000000-0000-0000-0000-000000000019', 'education_level', 'IN', 'undergraduate, postgraduate, diploma', 1, 'Studying in recognized post-matric course at a recognized college.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000019';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000191', 'a1000000-0000-0000-0000-000000000019', 'Income Certificate', 1, 'Issued by Revenue Authority not below the rank of Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000192', 'a1000000-0000-0000-0000-000000000019', 'EBC / General Category Declaration', 1, 'Self-affidavit confirming non-reserved category status.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000193', 'a1000000-0000-0000-0000-000000000019', 'Marksheet of Qualifying Examination', 1, 'Proof of having passed the previous academic milestone.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000194', 'a1000000-0000-0000-0000-000000000019', 'Institutional Bonafide Certificate', 1, 'Signed by Principal or Head of Institution.');


-- =========================================================================
-- 20. Google Generation Scholarship (APAC) for Women in Computer Science
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000020',
  'Google Generation Scholarship (APAC) for Women in Computer Science',
  'Google Inc.',
  'Supports women studying computer science and gaming to become leaders in tech, providing tuition scholarship and access to Google networking retreats.',
  '₹2,00,000 ($2,500 USD equivalent tuition award)',
  200000,
  '2026-11-01',
  'https://buildyourfuture.withgoogle.com/scholarships',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000020';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000201', 'a1000000-0000-0000-0000-000000000020', 'gender', 'EQ', 'female', 1, 'Must identify as a female student.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000202', 'a1000000-0000-0000-0000-000000000020', 'field_of_study', 'IN', 'Engineering, Computer Science, Information Technology, AI', 1, 'Must be studying Computer Science, Computer Engineering, or related technical field.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000203', 'a1000000-0000-0000-0000-000000000020', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be enrolled in 1st, 2nd, or 3rd year of undergraduate or postgraduate studies.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000204', 'a1000000-0000-0000-0000-000000000020', 'cgpa', 'GTE', '7.5', 1, 'Strong academic record with minimum 7.5 CGPA / equivalent.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000020';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000201', 'a1000000-0000-0000-0000-000000000020', 'Resume / CV', 1, 'Detailing technical projects, coding skills, and community work.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000202', 'a1000000-0000-0000-0000-000000000020', 'Current Academic Transcript', 1, 'Official semester transcript showing CGPA ≥ 7.5.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000203', 'a1000000-0000-0000-0000-000000000020', 'Diversity and Tech Leadership Essay', 1, 'Essay responses explaining passion for computer science and diversity in tech.');


-- =========================================================================
-- 21. National Law Universities (NLU) Need-Cum-Merit Legal Scholarship
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000021',
  'National Law Universities (NLU) Need-Cum-Merit Legal Scholarship',
  'Bar Council of India Trust & Department of Justice',
  'Financial assistance for underprivileged and deserving law students admitted to 5-year integrated BA LLB / BBA LLB courses in recognized National Law Universities.',
  '₹75,000 per annum towards hostel and tuition fees',
  75000,
  '2026-10-30',
  'https://doj.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000021';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000211', 'a1000000-0000-0000-0000-000000000021', 'field_of_study', 'IN', 'Law, Legal Studies, Law & Legal Studies', 1, 'Must be enrolled in an approved full-time law program (BA LLB / BBA LLB / LLM).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000212', 'a1000000-0000-0000-0000-000000000021', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Must be studying in an undergraduate or postgraduate law course.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000213', 'a1000000-0000-0000-0000-000000000021', 'family_income', 'LTE', '500000', 1, 'Annual family income must not exceed ₹5,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000214', 'a1000000-0000-0000-0000-000000000021', 'cgpa', 'GTE', '6.5', 1, 'Must maintain minimum 6.5 CGPA in university semester examinations.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000021';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000211', 'a1000000-0000-0000-0000-000000000021', 'CLAT / AILET Admission Scorecard & Allotment', 1, 'Proof of entrance examination rank and NLU admission letter.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000212', 'a1000000-0000-0000-0000-000000000021', 'Parental Income Certificate', 1, 'Issued by competent revenue authority or ITR statement.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000213', 'a1000000-0000-0000-0000-000000000021', 'College ID Card & Bonafide Certificate', 1, 'Signed by Dean / Registrar of the National Law University.');


-- =========================================================================
-- 22. Mahindra All India Talent Scholarship (MAITS) for Polytechnic Diploma
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000022',
  'Mahindra All India Talent Scholarship (MAITS) for Polytechnic Diploma',
  'K. C. Mahindra Education Trust',
  'Awarded to deserving students from rural and economically weaker backgrounds who have secured admission in government-recognized Polytechnic Diploma institutes.',
  '₹10,000 per annum for 3 years (₹30,000 total)',
  10000,
  '2026-09-30',
  'https://www.kcmet.org',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000022';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000221', 'a1000000-0000-0000-0000-000000000022', 'education_level', 'EQ', 'diploma', 1, 'Must be enrolled in a recognized 3-year Polytechnic Diploma course.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000222', 'a1000000-0000-0000-0000-000000000022', 'family_income', 'LTE', '150000', 1, 'Annual family income must be less than ₹1,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000223', 'a1000000-0000-0000-0000-000000000022', 'previous_marks_percentage', 'GTE', '60', 1, 'Passed 10th or 12th standard with minimum 60% aggregate marks.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000022';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000221', 'a1000000-0000-0000-0000-000000000022', '10th / 12th Board Marksheet', 1, 'Certified copy of marksheet showing minimum 60%.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000222', 'a1000000-0000-0000-0000-000000000022', 'Polytechnic Admission Letter / Fee Receipt', 1, 'Proof of admission to 1st year diploma engineering course.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000223', 'a1000000-0000-0000-0000-000000000022', 'Family Income Proof', 1, 'BDO / Tehsildar certificate or BPL card copy.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000224', 'a1000000-0000-0000-0000-000000000022', 'Student Bank Passbook', 1, 'Copy of front page of bank account.');


-- =========================================================================
-- 23. NHFDC Trust Fund Scholarship for Students with Disabilities
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000023',
  'NHFDC Trust Fund Scholarship for Students with Disabilities',
  'Department of Empowerment of Persons with Disabilities, Govt. of India',
  'Trust Fund scholarship for differently-abled students pursuing professional or technical degree and postgraduate courses from recognized Indian universities.',
  '₹48,000 per annum (₹3,000/mo maintenance + ₹12,000/yr book grant)',
  48000,
  '2026-11-15',
  'https://www.nhfdc.nic.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000023';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000231', 'a1000000-0000-0000-0000-000000000023', 'is_pwd', 'EQ', '1', 1, 'Applicant must be a person with benchmark disability (40% or more).');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000232', 'a1000000-0000-0000-0000-000000000023', 'family_income', 'LTE', '300000', 1, 'Gross annual family income must not exceed ₹3,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000233', 'a1000000-0000-0000-0000-000000000023', 'education_level', 'IN', 'undergraduate, postgraduate, diploma', 1, 'Enrolled in professional or technical degree / diploma programs.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000234', 'a1000000-0000-0000-0000-000000000023', 'previous_marks_percentage', 'GTE', '50', 1, 'Minimum 50% marks in the qualifying board or degree examination.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000023';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000231', 'a1000000-0000-0000-0000-000000000023', 'Disability Certificate (UDID Card)', 1, 'Government UDID card or medical board certificate showing ≥40% disability.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000232', 'a1000000-0000-0000-0000-000000000023', 'Income Certificate', 1, 'Issued by authorized Revenue Officer / Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000233', 'a1000000-0000-0000-0000-000000000023', 'University Bonafide Certificate', 1, 'Signed by Dean / Principal confirming current full-time enrollment.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000234', 'a1000000-0000-0000-0000-000000000023', 'Previous Marksheet', 1, 'Proof of scoring at least 50% in qualifying examination.');


-- =========================================================================
-- 24. DCE Kerala Suvarna Jubilee Merit Scholarship
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000024',
  'DCE Kerala Suvarna Jubilee Merit Scholarship',
  'Directorate of Collegiate Education, Government of Kerala',
  'State merit-cum-means scholarship for first-year undergraduate and postgraduate students from Below Poverty Line (BPL) families in Kerala.',
  '₹10,000 per annum',
  10000,
  '2026-11-25',
  'https://dcescholarship.kerala.gov.in',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000024';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000241', 'a1000000-0000-0000-0000-000000000024', 'domicile_state', 'EQ', 'Kerala', 1, 'Applicant must be a native / permanent resident of Kerala.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000242', 'a1000000-0000-0000-0000-000000000024', 'family_income', 'LTE', '100000', 1, 'Belonging to BPL category or annual family income ≤ ₹1,00,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000243', 'a1000000-0000-0000-0000-000000000024', 'previous_marks_percentage', 'GTE', '50', 1, 'Must have secured minimum 50% in Plus-Two or Degree exam.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000244', 'a1000000-0000-0000-0000-000000000024', 'education_level', 'IN', 'undergraduate, postgraduate', 1, 'Enrolled in regular UG or PG course in a recognized college in Kerala.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000024';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000241', 'a1000000-0000-0000-0000-000000000024', 'Kerala Nativity / Domicile Certificate', 1, 'Issued by Village Officer / Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000242', 'a1000000-0000-0000-0000-000000000024', 'BPL Ration Card / Income Certificate', 1, 'Showing BPL category or income ≤ ₹1,00,000.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000243', 'a1000000-0000-0000-0000-000000000024', 'Qualifying Marksheet', 1, 'Plus Two or Degree examination marksheet.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000244', 'a1000000-0000-0000-0000-000000000024', 'Student Bank Passbook', 1, 'First page of savings bank account passbook.');


-- =========================================================================
-- 25. Infosys Foundation "Aarohan" Social Innovation and STEM Scholarship
-- =========================================================================
INSERT INTO scholarships (
  id, name, provider, description, amount_description,
  amount_value, deadline, official_notice_url, created_by, is_published
) VALUES (
  'a1000000-0000-0000-0000-000000000025',
  'Infosys Foundation "Aarohan" Social Innovation and STEM Scholarship',
  'Infosys Foundation',
  'Promotes social innovation and educational equity by providing comprehensive tuition assistance to deserving students from rural and semi-urban communities enrolled in STEM and design degrees.',
  '₹1,00,000 per annum for tuition & living costs',
  100000,
  '2026-10-31',
  'https://www.infosys.com/infosys-foundation',
  'u1000000-0000-0000-0000-000000000001',
  1
)
ON CONFLICT(id) DO UPDATE SET
  name = excluded.name,
  provider = excluded.provider,
  description = excluded.description,
  amount_description = excluded.amount_description,
  amount_value = excluded.amount_value,
  deadline = excluded.deadline,
  official_notice_url = excluded.official_notice_url,
  is_published = excluded.is_published;

DELETE FROM eligibility_rules WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000025';
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000251', 'a1000000-0000-0000-0000-000000000025', 'area_type', 'EQ', 'rural', 1, 'Must belong to a rural village or gram panchayat jurisdiction.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000252', 'a1000000-0000-0000-0000-000000000025', 'family_income', 'LTE', '450000', 1, 'Annual family income must not exceed ₹4,50,000.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000253', 'a1000000-0000-0000-0000-000000000025', 'field_of_study', 'IN', 'Engineering, Science, Computer Science, Architecture, STEM', 1, 'Enrolled in STEM, Engineering, Computer Science, or Architecture.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000254', 'a1000000-0000-0000-0000-000000000025', 'education_level', 'EQ', 'undergraduate', 1, 'Must be enrolled in a 4-year undergraduate degree program.');
INSERT INTO eligibility_rules (id, scholarship_id, field_name, operator, expected_value, is_mandatory, rule_description)
VALUES ('r1000000-0000-0000-0000-000000000255', 'a1000000-0000-0000-0000-000000000025', 'previous_marks_percentage', 'GTE', '70', 1, 'Minimum 70% in Class 12 board examination.');

DELETE FROM scholarship_documents WHERE scholarship_id = 'a1000000-0000-0000-0000-000000000025';
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000251', 'a1000000-0000-0000-0000-000000000025', 'Rural Residence Certificate', 1, 'Issued by Gram Panchayat Pradhan or BDO.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000252', 'a1000000-0000-0000-0000-000000000025', 'Family Income Certificate', 1, 'Income certificate issued by Tehsildar.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000253', 'a1000000-0000-0000-0000-000000000025', 'Class 12 Board Certificate & Marksheet', 1, 'Showing aggregate percentage ≥ 70%.');
INSERT INTO scholarship_documents (id, scholarship_id, document_name, is_mandatory, instructions)
VALUES ('d1000000-0000-0000-0000-000000000254', 'a1000000-0000-0000-0000-000000000025', 'College Admission Allotment Letter & Fee Receipt', 1, 'Proof of admission into undergraduate STEM course.');
