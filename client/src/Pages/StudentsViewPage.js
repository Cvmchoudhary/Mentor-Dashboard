import React, { useState, useEffect } from "react";
import { Container, Table, ButtonGroup, Button } from "react-bootstrap";
import NavigationBar from "../Components/NavigationBar";
import { getAssignedStudents, unassignStudent } from "../utils/api";
import { useNavigate } from "react-router-dom";

const StudentsViewPage = () => {
  let mentor = localStorage.getItem("mentor");
  if (mentor) mentor = JSON.parse(mentor);

  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [evaluatedFilter, setEvaluatedFilter] = useState("all");

  const fetchStudents = async () => {
    const data = await getAssignedStudents(mentor.id);
    setStudents(data);
    setFilteredStudents(data);
  };

  const filterStudents = (filter) => {
    switch (filter) {
      case "pending":
        setFilteredStudents(
          students.filter(
            (student) =>
              student.evaluated_by === null &&
              (student.idea_marks !== null ||
                student.execution_marks !== null ||
                student.viva_marks !== null || // Changed from presentation_marks to viva_marks
                student.communication_marks !== null)
          )
        );
        break;
      case "evaluated":
        setFilteredStudents(
          students.filter(
            (student) =>
              student.evaluated_by !== null &&
              student.idea_marks !== null &&
              student.execution_marks !== null &&
              student.viva_marks !== null && // Changed from presentation_marks to viva_marks
              student.communication_marks !== null
          )
        );
        break;
      default:
        setFilteredStudents(students);
        break;
    }
  };

  const handleUnassign = async (studentId) => {
    await unassignStudent(mentor.id, studentId);
    await fetchStudents();
  };

  const evaluateStudent = (studentId) => {
    navigate(`/student-evaluate/${studentId}`);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <NavigationBar />
      <Container fluid className="mt-3">
        <ButtonGroup className="mb-3 gap-2">
          <Button
            variant="outline-primary"
            className={evaluatedFilter === "all" ? "active" : ""}
            onClick={() => {
              setEvaluatedFilter("all");
              setFilteredStudents(students);
            }}
          >
            All
          </Button>
          <Button
            variant="outline-primary"
            className={evaluatedFilter === "pending" ? "active" : ""}
            onClick={() => {
              setEvaluatedFilter("pending");
              filterStudents("pending");
            }}
          >
            Pending
          </Button>
          <Button
            variant="outline-primary"
            className={evaluatedFilter === "evaluated" ? "active" : ""}
            onClick={() => {
              setEvaluatedFilter("evaluated");
              filterStudents("evaluated");
            }}
          >
            Evaluated
          </Button>
        </ButtonGroup>
        <Table striped bordered hover className="align-middle text-center">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Idea Marks</th>
              <th>Execution Marks</th>
              <th>Viva Marks</th> {/* Changed from Presentation Marks to Viva Marks */}
              <th>Communication Marks</th>
              <th>Evaluate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.idea_marks ?? "-"}</td>
                <td>{student.execution_marks ?? "-"}</td>
                <td>{student.viva_marks ?? "-"}</td> {/* Changed from presentation_marks to viva_marks */}
                <td>{student.communication_marks ?? "-"}</td>
                <td>
                  {student.evaluated_by === null ? (
                    <Button
                      variant="primary"
                      onClick={() => evaluateStudent(student.id)}
                    >
                      Edit
                    </Button>
                  ) : (
                    <span>Evaluated</span>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleUnassign(student.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default StudentsViewPage;
