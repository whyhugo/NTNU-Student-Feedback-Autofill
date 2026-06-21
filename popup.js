const sliderLabels = {
    1: '⭐',
    2: '⭐⭐',
    3: '⭐⭐⭐',
    4: '⭐⭐⭐⭐',
    5: '⭐⭐⭐⭐⭐'
};

// 取得滑桿值轉換為課程意見的實際等級（左高右低）
function resolveCourseLevel(raw) {
    const numeric = Number(raw);
    if (Number.isNaN(numeric)) return 5;
    return 6 - numeric; // 1 -> 5(非常符合), 5 -> 1(非常不符合)
}

// 填寫「學習自評」區塊，回傳實際填寫的題數
function fillSelfEvaluation() {
    const radios = Array.from(document.querySelectorAll('input[id^="id_t1_"][type="radio"]'));
    const groups = new Map();

    radios.forEach((radio) => {
        const name = radio.name || radio.getAttribute('name');
        if (!name) return;
        if (!groups.has(name)) {
            groups.set(name, []);
        }
        groups.get(name).push(radio);
    });

    let filled = 0;
    groups.forEach((list) => {
        let target = null;
        list.forEach((radio) => {
            const idMatch = radio.id.match(/_g(\d+)/);
            const numericValue = Number(radio.value || (idMatch ? idMatch[1] : NaN));
            if (Number.isNaN(numericValue)) return;

            if (!target || numericValue > target.value) {
                target = { radio, value: numericValue };
            }
        });

        if (target) {
            target.radio.checked = true;
            filled += 1;
        }
    });

    return filled;
}

// 填寫「課程意見調查」區塊：依滑桿選擇 1~5 分，回傳實際填寫的題數
function fillCourseSurvey(level) {
    const questions = document.querySelectorAll('#part2 .jumbotron');
    const levelString = String(level);

    let filled = 0;
    questions.forEach((question) => {
        let radioButton = question.querySelector(`input[type="radio"][id$="_g${levelString}"]`);
        if (!radioButton) {
            radioButton = question.querySelector(`input[type="radio"][value="${levelString}"]`);
        }
        if (!radioButton) {
            radioButton = question.querySelector(`input[type="radio"][id*="_g${levelString}"]`);
        }

        if (radioButton) {
            radioButton.checked = true;
            filled += 1;
            const reasonCheckboxName = 'qq' + radioButton.id.substring(2);
            const reasonCheckboxes = document.querySelectorAll(`input[type="checkbox"][name="${reasonCheckboxName}"]`);
            reasonCheckboxes.forEach((checkbox) => {
                checkbox.checked = true;
            });
        }
    });

    const commentsTextarea = document.querySelector('textarea[name="n_textComments"]');
    if (commentsTextarea) {
        const commentByLevel = {
            5: '泰鼎了！',
            4: '不差太還差一點，像極了我的成績。',
            3: '掉進水裡撲通撲通，但還能游回來。',
            2: '肯定有什麼誤會。',
            1: '六星好評。'
        };
        commentsTextarea.value = commentByLevel[level] || '';
    }

    return filled;
}

const courseLabelMap = {
    1: '非常不符合',
    2: '不符合',
    3: '普通',
    4: '符合',
    5: '非常符合'
};

// 於擴充功能畫面內顯示提示訊息（取代會卡住 iframe 的 alert）
const statusEl = document.getElementById('status');
let statusTimer = null;
function showStatus(message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.add('visible');
    if (statusTimer) {
        clearTimeout(statusTimer);
    }
    statusTimer = setTimeout(() => {
        statusEl.classList.remove('visible');
    }, 2800);
}

// 在目前分頁（含所有 iframe）執行注入函式，並彙整各 frame 回傳的填寫題數
async function runInPage(func, args, onDone) {
    try {
        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true
        });
        if (!tabs || !tabs[0]) {
            showStatus('找不到作用中的分頁');
            return;
        }

        const injectionResults = await browser.scripting.executeScript({
            target: {
                tabId: tabs[0].id,
                allFrames: true
            },
            func: func,
            args: args
        });

        const total = (injectionResults || []).reduce((sum, item) => {
            return sum + (typeof item.result === 'number' ? item.result : 0);
        }, 0);
        if (typeof onDone === 'function') onDone(total);
    } catch (error) {
        console.error(error);
        showStatus('無法在此頁面執行，請確認位於問卷頁面');
    }
}

// 監聽學習自評：全部符合
document.getElementById('self-pass').addEventListener('click', () => {
    runInPage(fillSelfEvaluation, [], (count) => {
        showStatus(count > 0 ? `學習自評已填寫 ${count} 題` : '找不到可填寫的學習自評欄位');
    });
});

// 監聽學習自評：全部不符合
document.getElementById('self-fail').addEventListener('click', () => {
    runInPage(fillSelfEvaluation, [], (count) => {
        showStatus(count > 0 ? `學習自評已填寫 ${count} 題` : '找不到可填寫的學習自評欄位');
    });
});

// 更新滑桿標籤文字
const courseSlider = document.getElementById('course-slider');
const courseSliderText = document.getElementById('course-slider-text');
function updateSliderText() {
    const level = resolveCourseLevel(courseSlider.value);
    const label = sliderLabels[level] || `${level} 分`;
    courseSliderText.textContent = label;
}
courseSlider.addEventListener('input', updateSliderText);
updateSliderText();

// 套用課程意見調查
document.getElementById('apply-course').addEventListener('click', () => {
    const level = resolveCourseLevel(courseSlider.value);
    const label = courseLabelMap[level] || `${level} 分`;
    runInPage(fillCourseSurvey, [level], (count) => {
        showStatus(count > 0 ? `課程意見調查已填為「${label}」` : '找不到可填寫的課程意見欄位');
    });
});
