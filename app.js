// ===== MODEL =====
class StudentModel {
  constructor() {
    this.students = [];
  }

  addStudent(name, age, course) {
    const newStudent = {
      id: Date.now(),
      name,
      age,
      course,
    };
    this.students.push(newStudent);
  }

  deleteStudent(id) {
    this.students = this.students.filter(student => student.id !== id);
  }

  updateStudent(id, name, age, course) {
    const student = this.students.find(s => s.id === id);
    if (student) {
      student.name = name;
      student.age = age;
      student.course = course;
    }
  }

  getAllStudents() {
    return this.students;
  }
}

// ===== VIEW =====
class StudentView {
  constructor() {
    this.tableBody = document.getElementById("studentTableBody");
  }

  render(students, onEdit, onDelete) {
    this.tableBody.innerHTML = "";
    students.forEach(student => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${student.name}</td>
        <td>${student.age}</td>
        <td>${student.course}</td>
        <td>
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </td>
      `;

      row.querySelector(".delete").addEventListener("click", () => onDelete(student.id));
      row.querySelector(".edit").addEventListener("click", () => onEdit(student));

      this.tableBody.appendChild(row);
    });
  }

  fillForm(student) {
    document.getElementById("studentName").value = student.name;
    document.getElementById("studentAge").value = student.age;
    document.getElementById("studentCourse").value = student.course;
  }

  clearForm() {
    document.getElementById("studentName").value = "";
    document.getElementById("studentAge").value = "";
    document.getElementById("studentCourse").value = "";
  }
}

// ===== CONTROLLER =====
class StudentController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.editingId = null;

    // Add event listener for add button
    document.getElementById("addBtn").addEventListener("click", () => this.handleAddOrUpdate());

    // Initial render
    this.refreshView();
  }

  handleAddOrUpdate() {
    const name = document.getElementById("studentName").value;
    const age = parseInt(document.getElementById("studentAge").value);
    const course = document.getElementById("studentCourse").value;

    if (!name || !course) {
      alert("Please fill all fields!");
      return;
    }

    if (this.editingId) {
      this.model.updateStudent(this.editingId, name, age, course);
      this.editingId = null;
      document.getElementById("addBtn").textContent = "Add Student";
    } else {
      this.model.addStudent(name, age, course);
    }

    this.view.clearForm();
    this.refreshView();
  }

  handleEdit(student) {
    this.editingId = student.id;
    this.view.fillForm(student);
    document.getElementById("addBtn").textContent = "Update Student";
  }

  handleDelete(id) {
    this.model.deleteStudent(id);
    this.refreshView();
  }

  refreshView() {
    this.view.render(
      this.model.getAllStudents(),
      (student) => this.handleEdit(student),
      (id) => this.handleDelete(id)
    );
  }
}

// ===== APP INIT =====
document.addEventListener("DOMContentLoaded", () => {
  const app = new StudentController(new StudentModel(), new StudentView());
});
