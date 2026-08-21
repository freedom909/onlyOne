Dental Clinic SaaS Platform
Overview

A multi-tenant dental clinic management platform designed to support different clinic workflows through configurable business rules and resource management.

The platform separates common SaaS infrastructure from dental-specific business logic, allowing each clinic to configure its own treatments, resources, staff roles, and appointment workflows without changing the core application code.

Built with:

Domain-Driven Design (DDD)
GraphQL Federation
TypeScript
Multi-Tenant Architecture
Configurable Business Workflows
Features
Multi-Tenant Management
Tenant creation and management
Tenant membership management
Tenant switching
Active tenant validation
Tenant-level role management
Multi-tenant access control
Staff & Role Management

Supported dental clinic roles:

Owner
Manager
Doctor
Nurse
Receptionist
Hygienist
Accountant

Users can belong to multiple tenants and may have different roles in different clinics.

Patient Management
Patient registration
Patient information management
Patient-related appointment management
Treatment Management

Treatments are configurable per clinic.

Examples:

Dental Cleaning
X-Ray Examination
Laser Treatment
Root Canal Treatment
Other clinic-specific treatments

Each treatment can define its required resources and duration.

Resource Management

The system models clinic resources generically.

Examples:

Dental Chairs
Treatment Rooms
X-Ray Rooms
X-Ray Machines
Laser Equipment
Medical Equipment
Doctors
Other schedulable resources

Resources can be assigned according to treatment requirements and availability.

Appointment Scheduling

Appointment scheduling is based on:

Treatment
    ↓
Required Resource Types
    ↓
Available Resources
    ↓
Time Slot
    ↓
Resource Assignment
    ↓
Appointment

The system checks whether all required resources are available before confirming an appointment.

Configurable Clinic Workflows

Different clinics may have different:

Treatments
Resources
Staff structures
Appointment rules
Workflow steps
Scheduling requirements

The system therefore follows the principle:

Put business variations into configuration/data and keep stable business mechanisms in code.

Architecture
                         PLATFORM
                            │
              ┌─────────────┴─────────────┐
              ↓                           ↓
            User                        Tenant
              │                           │
              └──── Tenant Membership ────┘
                           │
                          Role
                           │
                      Permission
                           │
                           ↓
                    DENTAL DOMAIN
                           │
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
     Patient           Treatment           Staff
                            │
                            ↓
                   Resource Requirements
                            │
                            ↓
                        Resources
                            │
                            ↓
                       Availability
                            │
                            ↓
                   Resource Assignment
                            │
                            ↓
                       Appointment
Core Design Principles
1. Multi-Tenant by Design

Common SaaS infrastructure is shared while each tenant maintains its own business data and configuration.

User
 ↓
TenantMembership
 ↓
Tenant
 ↓
Role
 ↓
Permission
2. Configuration Over Hardcoding

Clinic-specific differences are represented as configuration rather than hard-coded business branches.

Instead of:

if (resource.type === "DENTAL_CHAIR") {
  // ...
}


if (resource.type === "XRAY_ROOM") {
  // ...
}

the scheduling engine operates on generic resource requirements:

Treatment
    ↓
Required Resource
    ↓
Available Resource
    ↓
Assignment

This allows the same scheduling mechanism to support different clinics and treatments.

3. Domain-Driven Design

The system separates:

Domain
Application
Infrastructure
Presentation

Business rules are kept inside the domain/application layers rather than being coupled directly to GraphQL or database implementations.

Tech Stack
Node.js
TypeScript
GraphQL
Apollo Federation
Apollo Server
MySQL
MongoDB
Redis
Docker
FastAPI
GraphQL Architecture

The backend uses a federated GraphQL architecture.

Core domains include:

Auth
User
Tenant
Patient
Treatment
Resource
Appointment
Payment
Audit

The API is composed through an Apollo Federation Gateway.

Resource Allocation Engine

The resource allocation mechanism is intentionally generic.

For each treatment requirement:

Required Resource Type
        ↓
Find Available Resources
        ↓
Check Required Quantity
        ↓
Select Resources
        ↓
Create Resource Assignment

Conceptually:

for (const requirement of requirements) {
  const availableResources =
    await findAvailableResources(
      requirement.resourceType,
      startAt,
      endAt
    );


  if (availableResources.length < requirement.quantity) {
    throw new ResourceUnavailableError();
  }


  assignments.push(
    ...selectResources(
      availableResources,
      requirement.quantity
    )
  );
}

The engine does not need to know whether a resource is a dental chair, X-ray room, laser machine, or another type of schedulable resource.

Security
OAuth authentication
JWT-based authentication
Tenant membership validation
Active membership verification
Tenant-level authorization
Role-based access control
Audit logging

Tenant switching is validated on the backend against the user's active tenant memberships.

Client-provided tenant IDs are never trusted without server-side membership verification.

Project Status
Completed
 DDD architecture
 GraphQL Federation
 Authentication
 User management
 Multi-tenant foundation
 Tenant membership
 Tenant switching
 Tenant role management
 Backend tenant access validation
 Configurable resource model
In Progress
 Patient management
 Treatment management
 Resource management UI
 Appointment scheduling
 Resource allocation
 Configurable clinic workflows
 Payment management
 Dental clinic dashboard
Project Goal

The goal of this project is not to build a separate hard-coded application for every dental clinic.

Instead, the platform provides a common business engine while allowing each clinic to configure its own:

Staff
Treatments
Resources
Schedules
Appointment Rules
Workflows