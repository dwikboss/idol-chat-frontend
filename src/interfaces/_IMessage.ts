export default interface Message {
  role: string;
  content: string;
  content_KR?: string;
  media?: string;
  grouped_message?: boolean;
}