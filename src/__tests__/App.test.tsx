import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../App';

describe('Frontier AI Atlas App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
    document.documentElement.classList.remove('dark');
  });

  it('renders the roadmap with 0/7 progress and all 7 stages', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Frontier AI Atlas' })).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 7 단계/)).toBeInTheDocument();
    expect(screen.getByText('AI를 이해하는 최소 수학 직관')).toBeInTheDocument();
    expect(screen.getByText('현대 프론티어 AI')).toBeInTheDocument();
  });

  it('navigates to a stage, toggles deep mode, and marks completion', () => {
    render(<App />);

    fireEvent.click(screen.getByText('딥러닝의 엔진'));
    expect(screen.getByText('직관 모드')).toBeInTheDocument();
    expect(screen.getByText('심화 모드')).toBeInTheDocument();

    // Deep dive content hidden in intuition mode
    expect(screen.queryByText('핵심 원문 논문')).not.toBeInTheDocument();

    // Switch to deep mode
    fireEvent.click(screen.getByText('심화 모드'));
    expect(screen.getAllByText('핵심 원문 논문').length).toBeGreaterThan(0);

    // Mark stage complete
    fireEvent.click(screen.getByText('학습 완료로 표시'));
    expect(screen.getByText('학습 완료됨')).toBeInTheDocument();
    expect(screen.getByText('1/7')).toBeInTheDocument();
  });

  it('toggles dark mode class on documentElement', () => {
    render(<App />);
    const themeBtn = screen.getByLabelText('다크 모드로 전환');
    fireEvent.click(themeBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByLabelText('라이트 모드로 전환')).toBeInTheDocument();
  });
});
