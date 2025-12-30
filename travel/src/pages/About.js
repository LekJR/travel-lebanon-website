import React from "react";

function About() {
  return (
    <div className="container py-4">
      <h1 className="mb-3">About Travel Planning Application</h1>

      <p>
        Our website helps users explore Lebanon by discovering cities, events,
        and activities. The goal is to make planning trips inside Lebanon
        simple, organized, and enjoyable.
      </p>

      <h2 className="mt-4">Our Team</h2>
      <ul>
        <li>Jad Rahi</li>
        <li>Karim Aoun</li>
      </ul>

      <h2 className="mt-4">What The First Phase Included</h2>
      <ul>
        <li>Frontend built with ReactJS and Bootstrap.</li>
        <li>Pages to view events, book them, and manage favourites.</li>
        <li>Basic login interface (no backend or database yet).</li>
      </ul>
      <h2 className="mt-4">What the Second Phase Includes</h2>
      <ul>
        <li>Backend API built with Node.js and Express.</li>
        <li>Database integration (MySQL).</li>
        <li>Full login and registration system.</li>
        <li>Ability to suggest new places to visit.</li>
        <li>Saving favourites and bookings in the database.</li>
        <li>Deployment to production server.</li>
        <li>Improvements to the UI and user experience.</li>
      </ul>
    </div>
  );
}

export default About;
