import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";
import NavigationBar from "../Components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { evaluateStudent, getStudentMarks, markStudent } from "../utils/api";

const StudentEvaluationPage = () => {
  let mentor = localStorage.getItem("mentor");
  if (mentor) mentor = JSON.parse(mentor);

  const navigate = useNavigate();
  const params = useParams();
  const studentId = params.id;

  const [student, setStudent] = useState({
    idea_marks: "",
    execution_marks: "",
    viva_marks: "", // Changed from presentation_marks to viva_marks
    communication_marks: "",
    total_marks: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await markStudent(mentor.id, studentId, {
      idea_marks: student.idea_marks,
      execution_marks: student.execution_marks,
      viva_marks: student.viva_marks, // Changed from presentation_marks to viva_marks
      communication_marks: student.communication_marks,
    });
    await fetchStudentDetails();
  };

  const handleCompleteEvaluation = async () => {
    await evaluateStudent(mentor.id, studentId);
    navigate("/student-view");
  };

  const fetchStudentDetails = async () => {
    const data = await getStudentMarks(studentId);
    setStudent({
      ...data,
      idea_marks: data.idea_marks | 0,
      execution_marks: data.execution_marks | 0,
      viva_marks: data.viva_marks | 0, // Changed from presentation_marks to viva_marks
      communication_marks: data.communication_marks | 0,
      total_marks: data.total_marks | 0,
    });
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  return (
    <>
      <NavigationBar />
      <Container fluid>
        <Form onSubmit={handleSubmit} className="p-3">
          <Card className="my-3">
            <Card.Body>
              <h3 style={{ color: "black" }}>{student.name}</h3>
              <p>Email: {student.email}</p>
              <p>Phone: {student.phone}</p>
            </Card.Body>
          </Card>
          <Form.Group controlId="ideaMarks">
            <Form.Label>Idea Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter idea marks"
              value={student?.idea_marks}
              onChange={(e) =>
                setStudent({ ...student, idea_marks: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="executionMarks" className="mt-2">
            <Form.Label>Execution Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter execution marks"
              value={student?.execution_marks}
              onChange={(e) =>
                setStudent({ ...student, execution_marks: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="vivaMarks" className="mt-2">
            <Form.Label>Viva Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter viva marks"
              value={student?.viva_marks}
              onChange={(e) =>
                setStudent({ ...student, viva_marks: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="communicationMarks" className="mt-2">
            <Form.Label>Communication Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter communication marks"
              value={student?.communication_marks}
              onChange={(e) =>
                setStudent({ ...student, communication_marks: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="totalMarks" className="mt-2">
            <Form.Label>Total Marks</Form.Label>
            <Form.Control type="text" value={student?.total_marks} disabled />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>{" "}
          <Button
            variant="success"
            onClick={handleCompleteEvaluation}
            className="mt-3"
          >
            Complete Evaluation
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default StudentEvaluationPage;
