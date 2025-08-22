const express = require("express");
const xml2js = require("xml2js");
const { create } = require("xmlbuilder2"); // 🟢 XML builder
const app = express();
const PORT = 3000;
const HOST = "34.29.39.188";   // important for external access

// Categories Data (no change)
const categoriesData = {
  categories: [
    {
      id: 1,
      name: "Electronics",
      products: [
        { id: 101, name: "Wireless Mouse", price: 499.99, currency: "INR", in_stock: true, rating: 4.3 },
        { id: 102, name: "Bluetooth Headphones", price: 1499.0, currency: "INR", in_stock: true, rating: 4.6 },
        { id: 103, name: "Smart Watch", price: 2499.0, currency: "INR", in_stock: false, rating: 4.1 },
        { id: 104, name: "Portable Speaker", price: 1999.0, currency: "INR", in_stock: true, rating: 4.4 },
        { id: 105, name: "Digital Camera", price: 9999.0, currency: "INR", in_stock: true, rating: 4.7 }
      ]
    },
    {
      id: 2,
      name: "Computers",
      products: [
        { id: 201, name: "Gaming Keyboard", price: 2299.5, currency: "INR", in_stock: false, rating: 4.8 },
        { id: 202, name: "External Hard Drive", price: 3999.0, currency: "INR", in_stock: true, rating: 4.5 },
        { id: 203, name: "Laptop Stand", price: 999.0, currency: "INR", in_stock: true, rating: 4.3 },
        { id: 204, name: "Mechanical Mouse Pad", price: 499.0, currency: "INR", in_stock: true, rating: 4.0 },
        { id: 205, name: "Gaming Laptop", price: 54999.0, currency: "INR", in_stock: true, rating: 4.9 }
      ]
    },
    {
      id: 3,
      name: "Home Appliances",
      products: [
        { id: 301, name: "Microwave Oven", price: 7499.0, currency: "INR", in_stock: true, rating: 4.4 },
        { id: 302, name: "Refrigerator", price: 15999.0, currency: "INR", in_stock: false, rating: 4.7 },
        { id: 303, name: "Washing Machine", price: 12999.0, currency: "INR", in_stock: true, rating: 4.6 },
        { id: 304, name: "Ceiling Fan", price: 1999.0, currency: "INR", in_stock: true, rating: 4.2 },
        { id: 305, name: "Air Conditioner", price: 28999.0, currency: "INR", in_stock: true, rating: 4.8 }
      ]
    },
    {
      id: 4,
      name: "Mobile",
      products: [
        { id: 401, name: "Smartphone X1", price: 12999.0, currency: "INR", in_stock: true, rating: 4.2 },
        { id: 402, name: "Smartphone Z Pro", price: 18999.0, currency: "INR", in_stock: true, rating: 4.6 },
        { id: 403, name: "Smartphone Ultra", price: 25999.0, currency: "INR", in_stock: false, rating: 4.7 },
        { id: 404, name: "Feature Phone Classic", price: 1999.0, currency: "INR", in_stock: true, rating: 4.0 },
        { id: 405, name: "Foldable Smartphone", price: 79999.0, currency: "INR", in_stock: true, rating: 4.9 }
      ]
    }
  ]
};

// 🟢 Company XML Data
const companyXML = `<?xml version="1.0" encoding="UTF-8"?>
<company>
  <metadata>
    <createdBy>HR System</createdBy>
    <createdDate>2025-08-13</createdDate>
    <departmentCount>3</departmentCount>
  </metadata>

  <departments>
    <department id="D001" name="Engineering">
      <manager>
        <name>Pradipta Biswas</name>
        <email>pradipta.biswas@example.com</email>
      </manager>
      <employees>
        <employee id="E101">
          <name>Vivek Misal</name>
          <title>Test Automation Engineer - B</title>
          <email>vivek.misal@example.com</email>
          <location>Mumbai, Maharashtra</location>
        </employee>
        <employee id="E102">
          <name>Ravi Kumar</name>
          <title>Software Developer</title>
          <email>ravi.kumar@example.com</email>
          <location>Pune, Maharashtra</location>
        </employee>
      </employees>
    </department>

    <department id="D002" name="Sales">
      <manager>
        <name>Akram Khan</name>
        <email>akram.khan@example.com</email>
      </manager>
      <employees>
        <employee id="E201">
          <name>Neha Sharma</name>
          <title>Sales Executive</title>
          <email>neha.sharma@example.com</email>
          <location>Delhi, India</location>
        </employee>
      </employees>
    </department>

    <department id="D003" name="HR">
      <manager>
        <name>Ritika Mehra</name>
        <email>ritika.mehra@example.com</email>
      </manager>
      <employees>
        <employee id="E301">
          <name>Arjun Patel</name>
          <title>HR Specialist</title>
          <email>arjun.patel@example.com</email>
          <location>Bangalore, Karnataka</location>
        </employee>
      </employees>
    </department>
  </departments>
</company>`;

// ✅ XML parser
const parser = new xml2js.Parser({ explicitArray: false });
let companyData = null;
parser.parseString(companyXML, (err, result) => {
  if (err) throw err;
  companyData = result.company;
});

// All categories
app.get("/api/categories", (req, res) => {
    const categories = categoriesData.categories.map(c => ({
      id: c.id,
      name: c.name
    }));
    res.json({ categories });
  });
// ---------------- CATEGORY ROUTES (JSON only) ----------------

// Product by category + id
app.get("/api/categories/:categoryName/:id", (req, res) => {
  const { categoryName, id } = req.params;
  const category = categoriesData.categories.find(
    c => c.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const product = category.products.find(p => p.id === parseInt(id));
  if (!product) {
    return res.status(404).json({ message: "Product not found in this category" });
  }

  res.json(product);
});

// Category by name
app.get("/api/categories/:categoryName", (req, res) => {
  const categoryName = req.params.categoryName.toLowerCase();
  const category = categoriesData.categories.find(c => c.name.toLowerCase() === categoryName);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: "Category not found" });
  }
});

// ---------------- EMPLOYEE ROUTES (XML only) ----------------

// 🟢 All employees in XML
app.get("/api/employees", (req, res) => {
  let allEmployees = [];

  companyData.departments.department.forEach(dept => {
    const employees = Array.isArray(dept.employees.employee)
      ? dept.employees.employee
      : [dept.employees.employee];

    employees.forEach(emp => {
      allEmployees.push({
        "@id": emp.$.id,
        name: emp.name,
        title: emp.title,
        email: emp.email,
        location: emp.location,
        department: dept.$.name
      });
    });
  });

  const xmlObj = { employees: { employee: allEmployees } };
  const xml = create(xmlObj).end({ prettyPrint: true });
  res.set("Content-Type", "application/xml");
  res.send(xml);
});

// 🟢 Single employee in XML
app.get("/api/employees/:id", (req, res) => {
  const empId = req.params.id;
  let foundEmployee = null;

  companyData.departments.department.forEach(dept => {
    const employees = Array.isArray(dept.employees.employee)
      ? dept.employees.employee
      : [dept.employees.employee];

    const emp = employees.find(e => e.$.id === empId);
    if (emp) {
      foundEmployee = {
        "@id": emp.$.id,
        name: emp.name,
        title: emp.title,
        email: emp.email,
        location: emp.location,
        department: dept.$.name
      };
    }
  });

  if (!foundEmployee) {
    return res.status(404).send("<error>Employee not found</error>");
  }

  const xmlObj = { employee: foundEmployee };
  const xml = create(xmlObj).end({ prettyPrint: true });
  res.set("Content-Type", "application/xml");
  res.send(xml);
});

// ---------------- START SERVER ----------------
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://34.29.39.188:3000`);
});
