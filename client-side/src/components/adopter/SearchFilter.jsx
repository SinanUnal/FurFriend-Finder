import React from 'react';
import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default function SearchFilter({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm, filterType);
  };

  return (
    <div>
        <Form>
      <Row className="align-items-center">
        <Col sm={8} className="my-1">
          <Form.Control 
            type="text" 
            placeholder="Search by name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </Col>
        <Col sm={3} className="my-1">
          <Form.Select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
            <option value="">Filter by Type</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="fish">Fish</option>
            <option value="bird">Bird</option>
            <option value="other">Other</option>
          </Form.Select>
        </Col>
        <Col xs="auto" className="my-1">
          <Button onClick={handleSearch}>Search</Button>
        </Col>
      </Row>
    </Form>
    </div>
  )
}
