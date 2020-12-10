import sanitiseInput from '../helpers/checkInput';

test("1. Allow clean data", () => {
    expect(sanitiseInput("Hello World")).toMatch("Hello World");
});

test("2. Remove script tags", () => {
    expect(sanitiseInput("<script>alert('you got hacked!')</script>")).toMatch("");
    expect(sanitiseInput("<ScrIpt>alert('you got hacked!')</ScriPt>")).toMatch("");
});

test("2. Remove onload and alerts tags", () => {
    expect(sanitiseInput("I love to do evil <img src='http://unsplash.it/100/100?random' onload='alert(\'you got hacked\');' />")).not.toMatch("onload");
    expect(sanitiseInput("I love to do evil <img src='http://unsplash.it/100/100?random' onload='alert(\'you got hacked\');' />")).not.toMatch("alert");
    expect(sanitiseInput("I love to do evil <img src='http://unsplash.it/100/100?random' OnlOAd='AleRt(\'you got hacked\');' />")).not.toMatch("onload");
    expect(sanitiseInput("I love to do evil <img src='http://unsplash.it/100/100?random' OnlOAd='AleRt(\'you got hacked\');' />")).not.toMatch("alert");
});
