import { PeekItem } from '../types.ts';

export const PEEK_DEFINITIONS: Record<string, PeekItem> = {
  react: {
    name: 'React',
    signature: 'const React: ReactFramework = { version: "19.0.0", concurrent: true };',
    description: 'Component-based UI library for creating responsive web interfaces and dynamic state-driven views.',
    category: 'web',
    projects: [
      { id: 'compliance-x', name: 'ComplianceX' },
      { id: 'ai-doc-assistant', name: 'DocuMind AI' },
    ],
  },
  typescript: {
    name: 'TypeScript',
    signature: 'type TypedCode<T> = T extends JavaScript ? SafeRobustProgram<T> : never;',
    description: 'Statically typed superset of JavaScript providing compile-time type safety and IntelliSense.',
    category: 'languages',
    projects: [
      { id: 'compliance-x', name: 'ComplianceX' },
    ],
  },
  fastapi: {
    name: 'FastAPI',
    signature: 'class FastAPI(routes: APIRouter[], docs_url="/docs", openapi_url="/openapi.json")',
    description: 'Modern, high-performance Python web framework for building asynchronous REST APIs with automatic OpenAPI docs.',
    category: 'backend',
    projects: [
      { id: 'compliance-x', name: 'ComplianceX' },
      { id: 'terraguard', name: 'TerraGuard' },
      { id: 'ai-doc-assistant', name: 'DocuMind AI' },
    ],
  },
  python: {
    name: 'Python',
    signature: 'def python_runtime() -> VersatileLanguage[AI, Backend, Data]: ...',
    description: 'High-level, expressive programming language widely used in AI/ML, computer vision, and backend services.',
    category: 'languages',
    projects: [
      { id: 'compliance-x', name: 'ComplianceX' },
      { id: 'terraguard', name: 'TerraGuard' },
      { id: 'driver-drowsiness', name: 'DrowsiGuard' },
      { id: 'ai-doc-assistant', name: 'DocuMind AI' },
    ],
  },
  chromadb: {
    name: 'ChromaDB',
    signature: 'class ChromaDB.Collection(name: str, embedding_function: EmbeddingModel)',
    description: 'Open-source vector database designed for semantic document retrieval and embedding nearest-neighbor search.',
    category: 'data',
    projects: [
      { id: 'compliance-x', name: 'ComplianceX' },
      { id: 'ai-doc-assistant', name: 'DocuMind AI' },
    ],
  },
  docker: {
    name: 'Docker',
    signature: 'FROM alpine:latest AS containerized_microservice\nCMD ["run", "service"]',
    description: 'Container engine that packages applications with runtime environments for consistent deployment.',
    category: 'tools-and-cloud',
    projects: [
      { id: 'compliance-x', name: 'ComplianceX' },
    ],
  },
  'scikit-learn': {
    name: 'Scikit-learn',
    signature: 'class RandomForestClassifier(n_estimators=100, max_depth=None, random_state=42)',
    description: 'Python machine learning toolkit providing regression, classification, clustering, and data preprocessing.',
    category: 'ai-and-vision',
    projects: [
      { id: 'terraguard', name: 'TerraGuard' },
    ],
  },
  'leaflet.js': {
    name: 'Leaflet.js',
    signature: 'const map = L.map("map").setView([lat, lng], zoom);',
    description: 'Lightweight JavaScript library for interactive mobile-friendly web maps and GeoJSON heatmaps.',
    category: 'web',
    projects: [
      { id: 'terraguard', name: 'TerraGuard' },
    ],
  },
  tensorflow: {
    name: 'TensorFlow',
    signature: 'class tf.keras.models.Sequential(layers: Layer[])',
    description: 'End-to-end open-source machine learning platform for building and deploying deep neural networks.',
    category: 'ai-and-vision',
    projects: [
      { id: 'driver-drowsiness', name: 'DrowsiGuard' },
    ],
  },
  keras: {
    name: 'Keras',
    signature: 'from tensorflow.keras import layers, Model',
    description: 'High-level deep learning API designed for fast experimentation and modular neural network architectures.',
    category: 'ai-and-vision',
    projects: [
      { id: 'driver-drowsiness', name: 'DrowsiGuard' },
    ],
  },
  opencv: {
    name: 'OpenCV',
    signature: 'cv2.VideoCapture(0) -> FrameStream[BGR, EyeDetection]',
    description: 'Real-time computer vision library for image processing, facial landmark detection, and video analysis.',
    category: 'ai-and-vision',
    projects: [
      { id: 'driver-drowsiness', name: 'DrowsiGuard' },
    ],
  },
  'gemini api': {
    name: 'Gemini API',
    signature: 'async function generateContent(prompt: string, context: PageChunk[]): Promise<Answer>',
    description: 'Multimodal AI model API by Google capable of reasoning over complex technical text with cited sources.',
    category: 'ai-and-vision',
    projects: [
      { id: 'ai-doc-assistant', name: 'DocuMind AI' },
    ],
  },
  rag: {
    name: 'RAG (Retrieval-Augmented Generation)',
    signature: 'type RAGPipeline = (query: string) => RetrieveChunks => LLMGenerateWithCitations;',
    description: 'Architecture that retrieves authoritative document sections before generating answers to ensure factual accuracy.',
    category: 'ai-and-vision',
    projects: [
      { id: 'compliance-x', name: 'ComplianceX' },
      { id: 'ai-doc-assistant', name: 'DocuMind AI' },
    ],
  },
  pydantic: {
    name: 'Pydantic',
    signature: 'class Schema(BaseModel): id: UUID; payload: Dict[str, Any]',
    description: 'Data validation and settings management library using Python type annotations.',
    category: 'backend',
    projects: [
      { id: 'compliance-x', name: 'ComplianceX' },
    ],
  },
  numpy: {
    name: 'NumPy',
    signature: 'np.ndarray[Shape[N, M], DType[float32]]',
    description: 'Fundamental package for scientific computing with multi-dimensional arrays and matrix mathematics in Python.',
    category: 'data',
    projects: [
      { id: 'driver-drowsiness', name: 'DrowsiGuard' },
      { id: 'terraguard', name: 'TerraGuard' },
    ],
  },
  pandas: {
    name: 'Pandas',
    signature: 'pd.DataFrame(data: Records, columns: Features)',
    description: 'Fast, flexible data analysis and manipulation tool for tabular and time-series data structures.',
    category: 'data',
    projects: [
      { id: 'terraguard', name: 'TerraGuard' },
    ],
  },
  geojson: {
    name: 'GeoJSON',
    signature: 'interface FeatureCollection { type: "FeatureCollection"; features: Feature[]; }',
    description: 'Standard format for encoding a variety of geographic data structures.',
    category: 'data',
    projects: [
      { id: 'terraguard', name: 'TerraGuard' },
    ],
  },
};

export function getPeekDefinition(tag: string): PeekItem | null {
  const normalized = tag.toLowerCase().trim();
  if (PEEK_DEFINITIONS[normalized]) {
    return PEEK_DEFINITIONS[normalized];
  }
  for (const [key, item] of Object.entries(PEEK_DEFINITIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return item;
    }
  }
  // Generic fallback peek definition
  return {
    name: tag,
    signature: `const ${tag.replace(/[^a-zA-Z0-9]/g, '_')}: TechnologyModule;`,
    description: `${tag} is a core technology used in building reliable web applications and intelligent systems.`,
    projects: [],
  };
}
