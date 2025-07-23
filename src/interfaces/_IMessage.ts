export default interface Message {
  role: string;
  content: string | Array<
    | { type: 'text'; text: string }
    | { type: 'image_url'; image_url: { url: string } }
  >;
  content_KR?: string;
  media?: string;
  grouped_message?: boolean;
  voice?: string;
}