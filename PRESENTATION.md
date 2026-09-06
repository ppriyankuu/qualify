## 🗣️ Full Presentation Script

Good morning everyone. My name is Priyanku, and this is my teamate Pranjeet Gogoi. And today we are here
to present a solution to our problem statement, which is a scholarship eligiblity portal.
So whithout wasting any time, let's just dive into it.

Every year, thousands of deserving students miss out on scholarships—not because they are not qualified, but because finding and understanding them is a nightmare.

Students often have to go through long PDF documents filled with complicated language. They have to figure out things like: Is my family income within the limit? Does my course qualify? What documents do I actually to need to submit?

And even when a platform has an eligibility checker, it often just says “Not Eligible” without any proper explanation.

This makes the whole process confusing, frustrating, and easy to miss-especially on deadlines.

That's why we tried to build a platform to solve this one sepcific problem.

---

I'll try to explain the workflow of the application.

Our system has two distinct login options: the **Administrator** and **Students**.

The **Administrator** is a simple component with one main job: maintaining the catalog of available scholarships. They can publish new scholarships by providing the title, provider, benefits, deadline, and a link to the official circular. Then, using the rule builder, they define explicit, visible rules in the database. For example: CGPA should be more than 7.5, family income should be less than ₹5,00,000, course should be in Engineering, and so on.

Now, in the real world, thousands of scholarships are published every year, but each issuing body formats its notices differently — different table layouts, legal wording, and eligibility criteria. To bring all of these into a single, understandable structure, we would need to implement a separate document-processing function.

That's why, for testing this prototype, we've preloaded our database with around 25 realistic mock scholarships.

---

Now, the second login option: the **Student**.

When a student registers, they fill out a standardized profile once. This holds their core credentials:

* Academics, like CGPA, current course, and education level.
* Financials, like annual family income.
* Demographics, like domicile state, social category, and PwD status.

This profile acts as the single source of truth for all eligibility checks.

Once the profile is saved, the student enters the **Scholarship Directory**. They can quickly filter scholarships by income limit, field of study, category, or education level.

---

Now let's look at the core of the application: **the evaluation pipeline**.

When a student selects a scholarship and opens its dedicated details page:

1. They see all the info related to that scholarship; like the amount they are providing, the education level they allow, or the last date to apply. 
2. they see the exact eligibility rules recorded in plain text.
2. They see an **interactive Document Checklist**, where they can tick off documents like *Income Certificate* or *Previous Marksheet* as they prepare them. This state is saved per user, without requiring them to upload any sensitive files.
3. They also see a direct link to the **official notice** for primary verification.

When the student clicks **"Check My Eligibility"**, the frontend sends their profile credentials to the backend, along with the list of documents they've ticked.

Our backend then runs a **deterministic evaluation engine**:

* It does **not** use an LLM API or an unexplained scoring system.
* Instead, it iterates over every eligibility rule and compares the student's actual values against the required values using strict comparison operators: `=`, `!=`, `<=`, `>=`, `IN`, or `CONTAINS`.

Each rule evaluates to one of three states: **PASS, FAIL, or UNKNOWN**.

PASS and FAIL are pretty straightforward.

**UNKNOWN** simply means that the rule requires some information that is missing from the student's profile.

After completing the evaluation of all the rules, the engine gives a simple verdict. There are three possibilities:

* **ELIGIBLE**: If 100% of the mandatory rules pass.
* **NOT ELIGIBLE**: If even one mandatory rule fails.
* **POSSIBLY ELIGIBLE**: If zero rules fail, but at least one is UNKNOWN. This avoids false negatives and tells the student exactly what they need to verify.

The engine also returns a detailed trace showing exactly how it arrived at that conclusion.

---

Coming to the technology stack:

The **frontend** is a simple **Next.js** application.

The **backend server** is built using a framework called **Hono**, and it's deployed on **Cloudflare Workers**.

We're also using **Cloudflare D1** as our database, which is just a serverless **SQLite** database.

The complete application is deployed and accessible on the internet. So, you can simply scan the **QR code** and access the website directly.


---

Finally, let me state the deliberate boundaries of our system:
- We **do not** collect or store sensitive PDF documents. The checklist is strictly for student preparation.
- We **do not** submit applications or guarantee official approval.

Thank you! We are now open to any questions.

