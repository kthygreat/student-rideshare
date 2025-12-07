// Show/hide car details based on role selection
document.getElementById('role')?.addEventListener('change', function() {
    const carDetails = document.getElementById('carDetails');
    if (this.value === 'driver' || this.value === 'both') {
        carDetails.style.display = 'block';
    } else {
        carDetails.style.display = 'none';
    }
});

// Student Registration
async function registerStudent() {
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        studentId: document.getElementById('studentId').value,
        program: document.getElementById('program').value,
        graduationYear: parseInt(document.getElementById('graduationYear').value),
        role: document.getElementById('role').value
    };

    // Add car details if driver
    if (userData.role === 'driver' || userData.role === 'both') {
        userData.carDetails = {
            make: document.getElementById('carMake').value,
            model: document.getElementById('carModel').value,
            year: parseInt(document.getElementById('carYear').value),
            color: document.getElementById('carColor').value,
            licensePlate: document.getElementById('licensePlate').value
        };
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        document.getElementById('api-response').textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById('api-response').textContent = 'Error: ' + error.message;
    }
}

// Admin: Get all students
async function getAllStudents() {
    try {
        const response = await fetch('/api/admin/students');
        const data = await response.json();
        document.getElementById('admin-results').innerHTML = 
            '<h3>All Students:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
    } catch (error) {
        document.getElementById('admin-results').textContent = 'Error: ' + error.message;
    }
}

// Admin: Get statistics
async function getStats() {
    try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        document.getElementById('admin-results').innerHTML = 
            '<h3>Statistics:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
    } catch (error) {
        document.getElementById('admin-results').textContent = 'Error: ' + error.message;
    }
}

// Load available rides into landing page
async function loadAvailableRides() {
    try {
        const resp = await fetch('/api/rides/available');
        const json = await resp.json();
        const rides = json.data || json || [];
        const container = document.getElementById('available-rides');
        if (!container) return;

        if (!rides.length) {
            container.innerHTML = '<p style="padding:20px;background:#fff;border-radius:8px">No upcoming rides available right now.</p>';
            return;
        }

        container.innerHTML = rides.map(ride => {
            const rideData = ride.from ? ride : {
                from: ride.startLocation,
                to: ride.destination,
                departureTime: ride.dateTime,
                availableSeats: ride.availableSeats,
                price: ride.price,
                notes: ride.notes
            };
            
            return `
                <article class="ride-card" style="border:1px solid rgba(0,0,0,0.06);padding:14px;margin-bottom:12px;border-radius:8px;background:#fff">
                    <h4 style="margin:0 0 6px 0">${rideData.from} → ${rideData.to}</h4>
                    <div style="font-size:0.95rem;color:#666;margin-bottom:8px">Departure: ${new Date(rideData.departureTime).toLocaleString()}</div>
                    <div style="display:flex;gap:12px;align-items:center;margin-bottom:8px"><strong>Seats:</strong> ${rideData.availableSeats} <strong>Price:</strong> $${rideData.price}</div>
                    <p style="margin:0 0 8px 0;color:#444">${rideData.notes || ''}</p>
                    <div>
                        <button onclick="bookRide('${ride._id}')" class="btn" style="background:#ffd43b;padding:8px 12px;border-radius:6px;text-decoration:none;color:#212529;border:none;cursor:pointer">Book Ride</button>
                    </div>
                </article>
            `;
        }).join('');
    } catch (err) {
        console.error('Failed to load rides', err);
    }
}

// Enhanced navigation - unified function
async function updateNavigation() {
    try {
        const resp = await fetch('/api/auth/profile');
        if (!resp.ok) {
            // User not logged in - show guest nav
            document.getElementById('nav-guest')?.style.display = 'flex';
            document.getElementById('nav-auth')?.style.display = 'none';
            document.getElementById('nav-login')?.classList.remove('hidden');
            document.getElementById('nav-register')?.classList.remove('hidden');
            document.getElementById('nav-profile')?.classList.add('hidden');
            document.getElementById('nav-signout')?.classList.add('hidden');
            return;
        }

        const user = await resp.json();
        // User logged in - show authenticated nav
        document.getElementById('nav-guest')?.style.display = 'none';
        document.getElementById('nav-auth')?.style.display = 'flex';
        document.getElementById('user-name-nav')?.textContent = user.username || user.email;
        document.getElementById('nav-login')?.classList.add('hidden');
        document.getElementById('nav-register')?.classList.add('hidden');
        document.getElementById('nav-profile')?.classList.remove('hidden');
        document.getElementById('nav-signout')?.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// Sign out handler
async function signOut() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
        console.warn('Logout request failed', e.message);
    }
    // Refresh navbar and redirect to home
    updateNavigation();
    window.location.href = '/';
}

// Ride CRUD Operations
async function createRide(rideData) {
    try {
        const response = await fetch('/api/rides', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rideData)
        });
        
        if (response.ok) {
            const data = await response.json();
            alert('Ride created successfully!');
            return data;
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create ride');
        }
    } catch (error) {
        console.error('Error creating ride:', error);
        alert('Error: ' + error.message);
    }
}

async function updateRide(rideId, rideData) {
    try {
        const response = await fetch(`/api/rides/${rideId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rideData)
        });
        
        if (response.ok) {
            alert('Ride updated successfully!');
            return await response.json();
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update ride');
        }
    } catch (error) {
        console.error('Error updating ride:', error);
        alert('Error: ' + error.message);
    }
}

async function deleteRide(rideId) {
    if (confirm('Are you sure you want to delete this ride?')) {
        try {
            const response = await fetch(`/api/rides/${rideId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Ride deleted successfully!');
                return true;
            } else {
                throw new Error('Failed to delete ride');
            }
        } catch (error) {
            console.error('Error deleting ride:', error);
            alert('Error: ' + error.message);
        }
    }
    return false;
}

// Booking Operations
async function bookRide(rideId) {
    try {
        // Check if user is logged in
        const profileResp = await fetch('/api/auth/profile');
        if (!profileResp.ok) {
            window.location.href = '/login.html';
            return;
        }

        const user = await profileResp.json();
        const seats = prompt('How many seats would you like to book?', '1');
        
        if (seats && parseInt(seats) > 0) {
            const bookingData = {
                rideId: rideId,
                numberOfSeats: parseInt(seats)
            };

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            
            if (response.ok) {
                alert('Booking created successfully!');
                window.location.href = '/dashboard.html';
            } else {
                const error = await response.json();
                alert('Error: ' + error.message);
            }
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('Error creating booking. Please try again.');
    }
}

async function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        try {
            const response = await fetch(`/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'cancelled' })
            });
            
            if (response.ok) {
                alert('Booking cancelled successfully!');
                return true;
            } else {
                throw new Error('Failed to cancel booking');
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Error: ' + error.message);
        }
    }
    return false;
}

// Load user's rides for dashboard
async function loadMyRides() {
    try {
        const response = await fetch('/api/rides/my-rides');
        const rides = await response.json();
        const ridesList = document.getElementById('my-rides-list');
        
        if (!ridesList) return;

        if (!rides.length) {
            ridesList.innerHTML = '<p>You haven\'t created any rides yet.</p>';
            return;
        }

        ridesList.innerHTML = rides.map(ride => `
            <div class="ride-card" style="border:1px solid #ddd; padding:15px; margin-bottom:10px; border-radius:8px;">
                <h3>${ride.startLocation} → ${ride.destination}</h3>
                <p><strong>Date:</strong> ${new Date(ride.dateTime).toLocaleString()}</p>
                <p><strong>Seats:</strong> ${ride.availableSeats} | <strong>Price:</strong> $${ride.price}</p>
                <div style="margin-top:10px;">
                    <button onclick="editRide('${ride._id}')" style="background:#6c757d; color:white; border:none; padding:5px 10px; border-radius:4px; margin-right:5px;">Edit</button>
                    <button onclick="deleteRide('${ride._id}')" style="background:#dc3545; color:white; border:none; padding:5px 10px; border-radius:4px;">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading my rides:', error);
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadAvailableRides();
    updateNavigation();
    
    // Wire signout click
    document.addEventListener('click', function(e) {
        if (e.target && (e.target.id === 'nav-signout' || e.target.closest('#nav-signout'))) {
            e.preventDefault();
            signOut();
        }
    });
});