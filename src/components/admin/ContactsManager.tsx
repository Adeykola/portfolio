import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Eye, Trash2, Clock, Reply, Archive } from 'lucide-react';
import { db } from '../../lib/supabase';
import { Contact } from '../../types';
import toast from 'react-hot-toast';

const statusIcons = {
  new: Clock,
  read: Eye,
  replied: Reply,
  archived: Archive,
};

const statusColors = {
  new: 'bg-blue-500',
  read: 'bg-yellow-500',
  replied: 'bg-green-500',
  archived: 'bg-gray-500',
};

export const ContactsManager: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await db.getContacts();
      setContacts(data);
    } catch (error: any) {
      toast.error('Failed to load contacts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await db.updateContactStatus(id, status);
      setContacts(contacts.map(c => c.id === id ? { ...c, status: status as any } : c));
      toast.success('Status updated successfully');
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await db.deleteContact(id);
      setContacts(contacts.filter(c => c.id !== id));
      toast.success('Contact deleted successfully');
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    } catch (error: any) {
      toast.error('Failed to delete contact');
    }
  };

  const openContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.status === 'new') {
      updateStatus(contact.id, 'read');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
          <p className="text-gray-400 mt-2">Manage contact form submissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-1 space-y-4">
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No messages yet</h3>
              <p className="text-gray-400">Contact messages will appear here</p>
            </div>
          ) : (
            contacts.map((contact, index) => {
              const StatusIcon = statusIcons[contact.status];
              return (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => openContact(contact)}
                  className={`bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer ${
                    selectedContact?.id === contact.id ? 'ring-2 ring-cyan-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium truncate">{contact.name}</h3>
                    <div className={`p-1 ${statusColors[contact.status]} rounded-full`}>
                      <StatusIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{contact.email}</p>
                  <p className="text-sm text-gray-300 font-medium mb-2 truncate">{contact.subject}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-2">
          {selectedContact ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedContact.subject}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>From: {selectedContact.name}</span>
                    <span>•</span>
                    <span>{selectedContact.email}</span>
                    <span>•</span>
                    <span>{new Date(selectedContact.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateStatus(selectedContact.id, e.target.value)}
                    className="bg-gray-700 text-white text-sm px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-white font-medium mb-3">Message:</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message}
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Reply className="h-4 w-4" />
                  Reply via Email
                </a>
                <button
                  onClick={() => updateStatus(selectedContact.id, 'archived')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
              <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Select a Contact</h3>
              <p className="text-gray-400">Choose a contact from the list to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};