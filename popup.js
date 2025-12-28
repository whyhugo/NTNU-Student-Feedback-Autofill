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

// 填寫「學習自評」區塊
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
        }
    });

    alert('學習自評已填為「全部符合」');
}

// 填寫「課程意見調查」區塊：依滑桿選擇 1~5 分
function fillCourseSurvey(level) {
    const questions = document.querySelectorAll('#part2 .jumbotron');
    const levelString = String(level);

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

    const labelMap = {
        1: '非常不符合',
        2: '不符合',
        3: '普通',
        4: '符合',
        5: '非常符合'
    };
    const label = labelMap[level] || `${level} 分`;
    alert(`課程意見調查已填為「${label}」`);
}

// 監聽學習自評：全部符合
document.getElementById('self-pass').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: fillSelfEvaluation,
            args: []
        });
    });
});

// 監聽學習自評：全部不符合
document.getElementById('self-fail').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: fillSelfEvaluation,
            args: []
        });
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: fillCourseSurvey,
            args: [level]
        });
    });
});