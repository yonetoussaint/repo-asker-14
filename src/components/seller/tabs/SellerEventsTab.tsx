import React from 'react';
import { Calendar, Plus, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SellerEventsTabProps {
  onCreateEvent?: () => void;
}

const SellerEventsTab: React.FC<SellerEventsTabProps> = ({ onCreateEvent }) => {
  // Mock events data - replace with real data when available
  const events = [
    {
      id: '1',
      title: 'Flash Sale Weekend',
      description: 'Get up to 50% off on all electronics this weekend only!',
      date: '2024-02-01',
      time: '9:00 AM',
      type: 'sale',
      location: 'Online Store',
      attendees: 245
    },
    {
      id: '2',
      title: 'New iPhone 15 Launch',
      description: 'Be the first to get the latest iPhone with exclusive launch offers.',
      date: '2024-02-05',
      time: '10:00 AM',
      type: 'launch',
      location: 'Main Store',
      attendees: 89
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'launch':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 bg-white rounded-lg p-4 border border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Events</h2>
          <p className="text-sm text-gray-600">Organize sales, launches, and special events</p>
        </div>
        <Button
          onClick={onCreateEvent}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      {/* Events List */}
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(event.type)}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{event.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees} interested</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Edit Event
                  </Button>
                  <Button variant="outline" size="sm">
                    Share
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(event.date) > new Date() ? 'Upcoming' : 'Past Event'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
          <p className="text-gray-500 mb-4">Create events to engage with your customers</p>
          <Button onClick={onCreateEvent} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Event
          </Button>
        </div>
      )}
    </div>
  );
};

export default SellerEventsTab;