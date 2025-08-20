# Cloud Cost Estimator

A full-stack application to estimate cloud costs across regions and resource types. Users can select regions, resources (compute, database, storage), and specify units to calculate total costs dynamically. A detailed bill with breakdowns is also available.  


---

## 📌 Features  

- Select **cloud regions** dynamically (fetched from backend).  
- Choose **resource types** (compute, database, storage).  
- Enter number of units for resources.  
- View **total estimated cost**.  
- Generate a **detailed bill** with per-resource breakdown.  

---

## ⚙️ Setup Instructions  

### 1. Backend (Spring Boot)  

#### Requirements  
- Java 17+  
- Maven/Gradle  
- PostgreSQL/MySQL (or H2 for testing)  

#### Steps  
1. Clone the repository.  
2. Navigate to backend directory.  
3. Update `application.properties` with DB config. Example:  
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/cloudcost
   spring.datasource.username=your_user
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```  
4. Run the backend:  
   ```bash
   mvn spring-boot:run
   ```  
5. The backend API will be available at `http://localhost:8080`.  

#### Available APIs  
- `GET /api/regions` → Fetch all regions.  
- `GET /api/regions/{id}/resources` → Fetch resources for a region.  

---

### 2. Frontend (React)  

#### Requirements  
- Node.js 18+  
- npm or yarn  

#### Steps  
1. Navigate to frontend directory.  
2. Install dependencies:  
   ```bash
   npm install
   ```  
3. Start the development server:  
   ```bash
   npm run dev
   ```  
4. Access app at `http://localhost:3000`.  

---

## 🛠 Tech Stack  

### Frontend  
- React (Hooks, JSX)  
- Axios (for API calls)  
- CSS Modules  

### Backend  
- Spring Boot  
- Spring Data JPA (with custom queries)  
- Hibernate ORM  
- PostgreSQL/MySQL (or H2 for local dev)  

---


## 🚀 How It Works  

1. Frontend requests list of regions from backend.  
2. User selects a region → frontend requests resources for that region.  
3. User selects resource type & enters units.  
4. App calculates:  

   ```
   Total Cost = Unit Cost × Units × Region Multiplier
   ```  

5. Users can generate a **detailed bill** with all selected resources.  