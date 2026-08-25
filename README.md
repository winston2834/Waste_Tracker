# **1. What is LeftoverLab?**


 LeftoverLab is a campus food-waste tracking platform. It measures how much food gets thrown away in the college mess (dining hall) and at every cafeteria shop, turns that into simple dashboards, and lets students anonymously rate food quality — so mess staff, shop owners, and campus admins can see where waste is happening 
 
 and act on it. The platform is built around three simple ideas: 
 
 • Log it — staff record how much food is wasted, item by item, after every meal or shift. 
 
 • See it — dashboards turn those logs into daily totals, weekly trends, and (in the admin view) a short-term forecast. 
 
 • Hear it — students rate meals anonymously, giving staff direct feedback on what's working and what isn't. 


 # **2. Who Uses It** 
 
 LeftoverLab has four types of users, each with a different view of the app: 

 ![alt text](<Screenshot 2026-08-25 100600.png>)
 
# **3. Getting Started** 

**3.1  For Students / Guests :**
No account is needed. From the homepage, students can: 

• See today's total waste for the mess and for the cafeteria at a glance. Yes 

• Open the Mess or Cafeteria pages to browse waste charts and trends for any outlet.

• Go to "Report / Rate Food" to leave a fully anonymous 1–5 star rating and optional comment about a meal or a specific shop — no login required. 

**3.2  For Mess Incharge, Shop Owners & Admins** 
Staff accounts are created and assigned by the admin — there is no public sign-up. To log in: 

• Click the role you belong to in the top navigation (e.g. "Mess" or a specific shop). 

• Enter the email and password given to you by your campus admin. 

• You'll land on your role's dashboard automatically after logging in. 

Staff credentials are managed centrally. If you don't have login details, contact your campus admin — they can also change or reset passwords. 

# **4. Mess Dashboard** 

The Mess page tracks food waste in the campus dining hall across breakfast, lunch, and dinner (brunch + dinner only on Sundays). 

**4.1  Logging waste (Mess Incharge only)** 

Mess Incharge accounts see an entry form at the top of the page to log wasted items — item name and weight in 
kilograms — for a specific meal. 

**4.2  What everyone can see** 

• Wasted today, last 7 days total, and the average student rating for the mess. 

• "Waste totals" chart — switch between daily and weekly views, and filter by meal (breakfast / lunch / dinner or all). 

• 30-day trend line showing whether waste is rising or falling over time. 

• Item-wise breakdown for any date — see exactly which dishes were wasted and how much. 

# **5. Cafeteria & Shop Dashboards**

 The cafeteria covers six independent shops. Each shop has its own dashboard, visible to that shop's owner and to the admin.

![alt text](<Screenshot 2026-08-25 103948.png>)

Each shop dashboard shows the same core structure as the mess page, scoped to that shop: 

• An entry form for the shop owner to log wasted items. 

• Daily and weekly waste totals with trend charts. 

• Item-wise breakdown for any given date. 

• Anonymous student ratings and comments left about that specific shop.

# **6. Reporting / Rating Food**

Anyone — students or guests — can leave feedback via the "Report / Rate Food" page without logging in. To submit a rating:

 • Choose what you're rating: the mess, or a specific cafeteria shop. 
 
 • If rating the mess, pick which meal (breakfast, lunch, or dinner). 
 
 • Give a 1–5 star rating for food quality. 
 
 • Optionally add a short comment (up to 280 characters). 
 
 • Submit — the rating goes straight to that outlet's staff and the admin. It is completely anonymous. 


# 7. Admin Dashboard

The Admin view gives campus-wide visibility across every outlet, plus tools no other role has access to.

**7.1 Campus-wide totals & trends**

Total waste today across the mess and all six shops combined.
A 7-day breakdown per outlet, to compare who is wasting the most.
A 14-day campus-wide trend chart.

**7.2 AI-Powered Waste Forecast**

The admin dashboard includes a 7-day waste forecast, built using a linear regression model trained on the last 21 days of campus-wide totals. It projects where waste is headed over the coming week, shown as a dashed line alongside actual data, with a shaded confidence band reflecting the model's margin of error.

A percentage badge (e.g. "+8% next week") shows the projected direction and size of the change.
A "Top items to target" panel ranks the specific dishes contributing most to recent waste, so staff know where to focus first.

How it works: the model fits a straight trend line through recent daily totals (least-squares regression) and extends that line forward. It's intentionally simple and explainable — well suited to short-term (5–10 day) forecasting of food-waste patterns, which tend to move in fairly steady trends week to week.

**7.3 Drilling into an outlet**

Admins can select any individual outlet — the mess or any shop — to view its detailed dashboard, exactly as that outlet's own staff would see it.

**7.4 All student reports**

Every anonymous rating and comment submitted campus-wide is visible to the admin, filterable by outlet.

# 8. Behind the Scenes

For anyone curious about how LeftoverLab is built:

Frontend: React, styled with Tailwind CSS and shadcn/ui components, with Recharts powering all charts.
Backend: FastAPI (Python), designed to connect to a MongoDB database.
Forecasting: a lightweight linear regression model implemented directly in the app, with no external ML service required.

# 9. Quick Reference
Item   -  	Description

Homepage	- Snapshot of today's totals across mess and cafeteria.

"Mess" - 	Dining hall dashboard.

"Cafeteria" - 	Pick a shop to view its dashboard.

"Report / Rate Food"	- Anonymous feedback, no login needed.

Staff login links - 	In the site footer / navigation, per role.

Admin dashboard	- Campus-wide totals, forecast, and all reports (admin login only).
