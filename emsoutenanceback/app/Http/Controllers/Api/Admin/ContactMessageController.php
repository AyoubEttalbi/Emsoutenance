<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    /**
     * Get all contact messages
     */
    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->get();

        return response()->json([
            'data' => $messages,
            'total' => $messages->count(),
            'unread' => $messages->where('is_read', false)->count(),
        ]);
    }

    /**
     * Get a single contact message
     */
    public function show($id)
    {
        $message = ContactMessage::findOrFail($id);

        return response()->json([
            'data' => $message
        ]);
    }

    /**
     * Mark a message as read
     */
    public function markAsRead($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => true]);

        return response()->json([
            'message' => 'Message marqué comme lu',
            'data' => $message
        ]);
    }

    /**
     * Mark a message as unread
     */
    public function markAsUnread($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->update(['is_read' => false]);

        return response()->json([
            'message' => 'Message marqué comme non lu',
            'data' => $message
        ]);
    }

    /**
     * Delete a contact message
     */
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'message' => 'Message supprimé avec succès'
        ]);
    }
}
