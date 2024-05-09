export default interface Message {
  role: string;
  content: string;
  content_KR?: string;
  grouped_message?: boolean;
}