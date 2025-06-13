// 注入到頁面中執行的函式（最終版本）
function fillEvaluationForm(fillType) {
    // --- 預設填寫「學習自評」部分 ---
    const selfEval投入 = document.getElementById('id_t1_f1_g5');
    if (selfEval投入) {
        selfEval投入.checked = true;
    }
    const selfEval缺席 = document.getElementById('id_t1_f2_g4');
    if (selfEval缺席) {
        selfEval缺席.checked = true;
    }

    // --- 根據選擇填寫「課程意見調查」部分 ---
    const questions = document.querySelectorAll('#part2 .jumbotron');
    const valueToSelect = fillType === 'agree' ? '5' : '1';

    questions.forEach(question => {
        const radioButton = question.querySelector(`input[type="radio"][value="${valueToSelect}"]`);
        if (radioButton) {
            radioButton.checked = true;
            const reasonCheckboxName = 'qq' + radioButton.id.substring(2);
            const reasonCheckboxes = document.querySelectorAll(`input[type="checkbox"][name="${reasonCheckboxName}"]`);
            if (reasonCheckboxes.length > 0) {
                reasonCheckboxes.forEach(checkbox => {
                    checkbox.checked = true;
                });
            }
        }
    });

    // 尋找 name 為 'n_textComments' 的 textarea
    const commentsTextarea = document.querySelector('textarea[name="n_textComments"]');
    if (commentsTextarea) {
        if (fillType === 'agree') {
            commentsTextarea.value = 'ヾ(•ω•`)o';
        } else { // 'disagree' 的情況
            commentsTextarea.value = 'இ௰இ';
        }
    }

    alert('表單已自動填寫！\n包含「詳細原因」與「文字建議」均已填入，請再次確認內容無誤後再提交。');
}

// 監聽「非常符合」按鈕的點擊事件
document.getElementById('fill-agree').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: fillEvaluationForm,
            args: ['agree']
        });
    });
});

// 監聽「非常不符合」按鈕的點擊事件
document.getElementById('fill-disagree').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: fillEvaluationForm,
            args: ['disagree']
        });
    });
});