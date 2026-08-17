# JalFlow Database Schema

Database: MongoDB

## Collections

### users
| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | MongoDB identifier |
| name | String | Yes | User name |
| email | String | Yes | Login/contact email |
| role | String | Yes | admin/staff |
| createdAt | Date | Yes | Record creation time |

### customers
| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Customer identifier |
| name | String | Yes | Customer name |
| phone | String | Yes | Contact number |
| address | String | Yes | Delivery address |
| createdAt | Date | Yes | Record creation time |

### drivers
| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Driver identifier |
| name | String | Yes | Driver name |
| phone | String | Yes | Contact number |
| tankerNumber | String | Yes | Assigned tanker registration/number |
| status | String | Yes | Available/On Delivery/Offline |
| createdAt | Date | Yes | Record creation time |

### bookings
| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Booking identifier |
| bookingId | String | Yes | Human-readable booking ID |
| customer | ObjectId | Yes | References customers |
| driver | ObjectId | No | References drivers |
| waterQuantity | Number | Yes | Litres requested |
| deliveryDate | Date | Yes | Scheduled delivery |
| timeSlot | String | Yes | Preferred slot |
| paymentMethod | String | Yes | Cash/UPI |
| status | String | Yes | Pending/Confirmed/On the Way/Delivered/Cancelled |
| amount | Number | Yes | Booking amount |
| notes | String | No | Optional notes |
| createdAt | Date | Yes | Record creation time |

### payments
| Field | Type | Required | Description |
|---|---|---:|---|
| _id | ObjectId | Yes | Payment identifier |
| booking | ObjectId | Yes | References bookings |
| customer | ObjectId | Yes | References customers |
| amount | Number | Yes | Payment amount |
| method | String | Yes | Cash/UPI |
| status | String | Yes | Paid/Pending |
| reference | String | No | UPI/reference number |
| paymentDate | Date | Yes | Payment date |
| createdAt | Date | Yes | Record creation time |

## Relationships

```text
customers 1 ──── N bookings
customers 1 ──── N payments
drivers   1 ──── N bookings
bookings  1 ──── N payments
```

The MVP uses MongoDB references through Mongoose `ObjectId` fields.
