import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ApplyLoan = () => {
  const { loanId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [salary, setSalary] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [guarantor, setGuarantor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedStatus, setSubmittedStatus] = useState(null);
  
  // Live Preview State
  const [preview, setPreview] = useState(null);

  // AI Assessment & Calculation Logic
  const calculateLoan = (loanType, loanAmount, loanDuration) => {
    if (!loanAmount || isNaN(loanAmount)) return null;

    let interestRate = 0;
    switch(loanType) {
      case 'personal': interestRate = 0.045; break;
      case 'housing': interestRate = 0.032; break;
      case 'car': interestRate = 0.050; break;
      case 'investment': interestRate = 0.065; break;
      default: interestRate = 0.05;
    }

    const totalInterest = loanAmount * interestRate * (loanDuration / 12);
    const totalRepayment = loanAmount + totalInterest;
    const monthlyPayment = totalRepayment / loanDuration;

    return {
      interestRate: (interestRate * 100).toFixed(1) + '%',
      totalRepayment: totalRepayment.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(2)
    };
  };

  // Update preview when inputs change
  useEffect(() => {
    const result = calculateLoan(loanId, parseFloat(amount), parseInt(duration));
    setPreview(result);
  }, [amount, duration, loanId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const calc = calculateLoan(loanId, parseFloat(amount), parseInt(duration));
      
      // Determine Status for DB
      let status = 'قيد المراجعة';
      let aiReason = 'جاري مراجعة الطلب من قبل اللجنة المختصة.';
      const userSalary = parseFloat(salary);
      const monthlyPayment = parseFloat(calc.monthlyPayment);

      if (userSalary > (monthlyPayment * 2.5)) {
        status = 'مقبول';
        aiReason = 'تمت الموافقة الآلية: الدخل الشهري يغطي القسط والالتزامات بنسبة أمان عالية جداً (أكثر من 2.5 ضعف القسط).';
      } else if (userSalary < (monthlyPayment * 1.5)) {
        status = 'مرفوض';
        aiReason = 'عذراً، الدخل الشهري لا يسمح بمنح هذا القرض حالياً لأن نسبة الاستقطاع تتجاوز 65% من راتبك.';
      } else {
        status = 'قيد المراجعة';
        aiReason = 'التحليل الذكي: دخلك الشهري كافٍ تقنياً ولكن نسبة المخاطرة متوسطة. الطلب ينتظر مراجعة بشرية للتحقق من "اسم الكفيل" وصحة "المسمى الوظيفي" لضمان استمرارية السداد.';
      }

      await addDoc(collection(db, 'loan_applications'), {
        userId: auth.currentUser.uid,
        loanType: loanId,
        amount: parseFloat(amount),
        duration: parseInt(duration),
        salary: userSalary,
        jobTitle,
        phone,
        guarantor,
        purpose,
        ...calc,
        status,
        aiReason,
        createdAt: new Date().toISOString()
      });
      
      setSubmittedStatus(status);
    } catch (err) {
      setError(t('apply.error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)', marginTop: '8px' };
  const labelStyle = { display: 'block', fontWeight: '600', color: 'var(--text-1)' };

  if (submittedStatus) {
    return (
      <div className="container animate-fade" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 40px' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: submittedStatus === 'مرفوض' ? 'rgba(220, 53, 69, 0.1)' : 'rgba(30, 122, 52, 0.1)',
            color: submittedStatus === 'مرفوض' ? 'var(--danger)' : 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 30px'
          }}>
            <span className="material-icons-round" style={{ fontSize: '60px' }}>
              {submittedStatus === 'مرفوض' ? 'error_outline' : 'check_circle'}
            </span>
          </div>
          <h2 style={{ marginBottom: '16px' }}>
            {submittedStatus === 'مرفوض' ? 'تمت معالجة الطلب' : 'تم تقديم طلبك بنجاح!'}
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '1.1rem', marginBottom: '40px' }}>
            {submittedStatus === 'مقبول' 
              ? 'تهانينا! تمت الموافقة المبدئية على طلبك بناءً على تحليلاتنا الذكية.' 
              : submittedStatus === 'مرفوض'
              ? 'عذراً، لم نتمكن من الموافقة على طلبك حالياً لعدم كفاية الدخل الشهري.'
              : 'تم استلام طلبك وهو الآن قيد المراجعة النهائية من قبل موظفي البنك.'}
          </p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ flex: 1, padding: '14px', borderRadius: '10px' }}>
              لوحة التحكم
            </button>
            <button className="btn-outline" onClick={() => setSubmittedStatus(null)} style={{ flex: 1, padding: '14px', borderRadius: '10px' }}>
              تقديم طلب آخر
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade" style={{ padding: '60px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Form Column */}
        <div className="card" style={{ padding: '40px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-icons-round" style={{ color: 'var(--primary)' }}>app_registration</span>
              نموذج تقديم الطلب
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>{t('apply.amount')}</label>
                <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="5000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t('apply.salary')}</label>
                <input type="number" required value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="1000" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>{t('apply.jobTitle')}</label>
                <input type="text" required value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="مهندس" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>{t('apply.phone')}</label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xxxx" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>{t('apply.duration')}</label>
              <select value={duration} onChange={(e) => setDuration(e.target.value)} style={inputStyle}>
                {[12, 24, 36, 48, 60].map(m => <option key={m} value={m}>{m} شهر</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>{t('apply.guarantor')}</label>
              <input type="text" value={guarantor} onChange={(e) => setGuarantor(e.target.value)} placeholder="اسم الكفيل" style={inputStyle} />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>{t('apply.purpose')}</label>
              <textarea required value={purpose} onChange={(e) => setPurpose(e.target.value)} rows="3" style={{ ...inputStyle, resize: 'none' }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', backgroundColor: 'var(--primary)', color: 'white', padding: '18px', borderRadius: '12px', fontWeight: '700', fontSize: '1.1rem' }}>
              {loading ? t('common.loading') : 'إرسال طلب التمويل'}
            </button>
          </form>
        </div>

        {/* Live Preview Column (Requirement Match) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ border: '2px solid var(--secondary)40', position: 'sticky', top: '100px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <span className="material-icons-round" style={{ color: 'var(--secondary)' }}>calculate</span>
              {t('loans.calculation')} (معاينة فورية)
            </h3>
            
            {preview ? (
              <div className="animate-fade">
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>نسبة الفائدة المقدرة:</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>{preview.interestRate}</p>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>القسط الشهري التقريبي:</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '800' }}>{preview.monthlyPayment} $</p>
                </div>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-input)', borderRadius: '12px' }}>
                  <p style={{ color: 'var(--text-3)', fontSize: '0.9rem' }}>إجمالي المبلغ المستحق (المبلغ + الفوائد):</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '700' }}>{preview.totalRepayment} $</p>
                </div>
                <div style={{ marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-2)', display: 'flex', gap: '8px' }}>
                  <span className="material-icons-round" style={{ fontSize: '16px' }}>info</span>
                  هذه الحسابات مبدئية وتخضع لتحليل الـ AI النهائي.
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)' }}>
                <span className="material-icons-round" style={{ fontSize: '40px', opacity: 0.3 }}>analytics</span>
                <p style={{ marginTop: '12px' }}>أدخل المبلغ والمدة لرؤية الحسابات فوراً</p>
              </div>
            )}
          </div>
          
          <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
            <h4 style={{ color: 'white', marginBottom: '12px' }}>لماذا تختار بنك الاستثمار؟</h4>
            <ul style={{ paddingRight: '20px', fontSize: '0.9rem', opacity: 0.9 }}>
              <li>موافقة فورية مدعومة بالذكاء الاصطناعي</li>
              <li>أقل نسب فوائد في السوق</li>
              <li>بدون رسوم إضافية مخفية</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplyLoan;



