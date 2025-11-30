export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          pin: string;
          saldo: number;
          idioma: string;
          pais_preferido: string;
          operadora_preferida: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          pin: string;
          saldo?: number;
          idioma?: string;
          pais_preferido?: string;
          operadora_preferida?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          pin?: string;
          saldo?: number;
          idioma?: string;
          pais_preferido?: string;
          operadora_preferida?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          nome: string;
          logo_url: string | null;
          preco_opcao1: number;
          preco_opcao2: number;
          preco_opcao3: number;
          ativo: boolean;
          categoria: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          logo_url?: string | null;
          preco_opcao1: number;
          preco_opcao2: number;
          preco_opcao3: number;
          ativo?: boolean;
          categoria?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          logo_url?: string | null;
          preco_opcao1?: number;
          preco_opcao2?: number;
          preco_opcao3?: number;
          ativo?: boolean;
          categoria?: string | null;
          created_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_id?: string;
          created_at?: string;
        };
      };
      activations: {
        Row: {
          id: string;
          user_id: string;
          service_id: string;
          numero: string;
          status: string;
          codigo_sms: string | null;
          minutos_restantes: number;
          preco_pago: number;
          opcao_escolhida: number;
          created_at: string;
          expires_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          service_id: string;
          numero: string;
          status?: string;
          codigo_sms?: string | null;
          minutos_restantes?: number;
          preco_pago: number;
          opcao_escolhida: number;
          created_at?: string;
          expires_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          service_id?: string;
          numero?: string;
          status?: string;
          codigo_sms?: string | null;
          minutos_restantes?: number;
          preco_pago?: number;
          opcao_escolhida?: number;
          created_at?: string;
          expires_at?: string;
          completed_at?: string | null;
        };
      };
    };
  };
}
