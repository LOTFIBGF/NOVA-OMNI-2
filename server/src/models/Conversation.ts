import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  id: string;
  userId: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>({
  id: { type: String, required: true, unique: true, index: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true, default: 'New chat', maxlength: 120 },
}, { timestamps: true });

ConversationSchema.index({ userId: 1, updatedAt: -1 });

export interface IChatMessage extends Document {
  id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  id: { type: String, required: true, unique: true },
  conversationId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true },
  imageUrl: { type: String, default: null },
  audioUrl: { type: String, default: null },
  metadata: { type: Schema.Types.Mixed, default: null },
}, { timestamps: { createdAt: true, updatedAt: false } });

ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });

export const Conversation = mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema);
export const ChatMessage = mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
