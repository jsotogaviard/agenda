Assumptions:
 - starts_at and ends_at are in the same day or the end date is midnight:
 A physician can work from 23:30 to 00:30. In db it must be logged
 as two opening events one from 23:30 to 00:00 and the other one
 from 00:00 to 00:30
 
Covered and tested use cases:
 - A physician can work from 23:30 to 00:00 (following day)
 - An appointment that does not correspond to an opening
 throws an error
 - An opening that starts at 23:30 and finishes at 00:30 
 throws an error
 - Two appointments on the same time that correspond to an opening 
 throw an error

Improvements
 - Specify timezone for each location
getAvailabilities needs a new parameter : the timezone
 - How to handle the use case : the physician works every first wednesday
 of the month
 - Integrate holidays