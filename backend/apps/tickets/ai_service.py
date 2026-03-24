"""Serviço de integração com Google Gemini AI."""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)


def get_gemini_client():
    try:
        import google.generativeai as genai
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            return None
        genai.configure(api_key=api_key)
        return genai.GenerativeModel('gemini-1.5-flash')
    except Exception as exc:
        logger.warning('Gemini não disponível: %s', exc)
        return None


def suggest_ticket_response(ticket) -> str:
    """Gera uma sugestão de resposta para o ticket usando o Gemini."""
    model = get_gemini_client()
    if model is None:
        return ''

    comments_text = ''
    for c in ticket.comments.filter(is_internal=False).order_by('created_at')[:10]:
        role = 'Cliente' if c.author.role == 'client' else 'Agente'
        comments_text += f'\n{role}: {c.content}'

    prompt = f"""Você é um agente de suporte técnico experiente e prestativo.
Analise o ticket de suporte abaixo e forneça uma resposta profissional, clara e empática para o cliente.

**Título do ticket:** {ticket.title}
**Categoria:** {ticket.category.name if ticket.category else 'Sem categoria'}
**Prioridade:** {ticket.get_priority_display()}
**Descrição:**
{ticket.description}

**Histórico de conversas:**
{comments_text if comments_text else '(Sem comentários ainda)'}

Por favor, forneça:
1. Uma resposta direta ao problema do cliente
2. Possíveis passos para resolução
3. Prazo estimado (se aplicável)

Responda em português do Brasil, de forma profissional mas acessível."""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as exc:
        logger.error('Erro ao chamar Gemini: %s', exc)
        return ''


def auto_categorize_ticket(title: str, description: str, categories: list) -> str:
    """Sugere a melhor categoria para um ticket."""
    model = get_gemini_client()
    if model is None or not categories:
        return ''

    cat_list = '\n'.join(f'- {c["name"]}: {c.get("description", "")}' for c in categories)

    prompt = f"""Analise o título e a descrição do ticket abaixo e escolha a categoria mais adequada dentre as opções.

**Título:** {title}
**Descrição:** {description}

**Categorias disponíveis:**
{cat_list}

Responda APENAS com o nome exato da categoria escolhida, sem explicações adicionais."""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as exc:
        logger.error('Erro ao chamar Gemini: %s', exc)
        return ''


def summarize_ticket(ticket) -> str:
    """Gera um resumo executivo do ticket e seu histórico."""
    model = get_gemini_client()
    if model is None:
        return ''

    comments = list(ticket.comments.order_by('created_at').select_related('author'))
    history = '\n'.join(
        f'[{c.created_at.strftime("%d/%m %H:%M")}] {c.author.name}: {c.content}'
        for c in comments
    )

    prompt = f"""Faça um resumo executivo conciso do seguinte ticket de suporte, incluindo o problema, status atual e ações tomadas.

**Ticket #{ticket.pk}:** {ticket.title}
**Status:** {ticket.get_status_display()}
**Prioridade:** {ticket.get_priority_display()}
**Criado em:** {ticket.created_at.strftime('%d/%m/%Y %H:%M')}
**Descrição:**
{ticket.description}

**Histórico:**
{history if history else '(Sem interações)'}

Responda em português, em no máximo 5 linhas."""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as exc:
        logger.error('Erro ao chamar Gemini: %s', exc)
        return ''
